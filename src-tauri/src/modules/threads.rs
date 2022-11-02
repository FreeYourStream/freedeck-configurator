use std::{
    sync::{Arc, Mutex},
    thread::{self, JoinHandle},
    time::Duration,
};

use fd_lib::os::get_current_window;
use log::error;
use tauri::{AppHandle, Manager, Wry};

use super::state::FDState;
pub fn ports_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<FDState>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let state_ref = state_ref.clone();
    thread::spawn(move || {
        let mut ports = Vec::new();
        loop {
            thread::sleep(Duration::from_millis(500));
            let mut state = state_ref.lock().expect("mutex poisened");
            ports = state.serial.refresh_ports(ports.len(), |ports_string| {
                match app_clone
                    .app_handle()
                    .emit_all("ports_changed", ports_string)
                {
                    Ok(_) => {}
                    Err(e) => {
                        error!("Error sending ports_changed event: {}", e);
                    }
                }
            });
        }
    })
}

pub fn read_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<FDState>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let state = state_ref.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(10));

        let mut state = state.lock().expect("mutex poisened");

        let port = match state.serial.port.as_mut() {
            Some(port) => port,
            None => {
                continue;
            }
        };

        let available = match port.bytes_to_read() {
            Ok(to_read) => to_read,
            Err(e) => {
                error!("Error reading bytes: {}", e);
                continue;
            }
        };

        if available == 0 {
            continue;
        }

        let mut response = vec![0; available as usize];

        let bytes_read = match port.read(&mut response) {
            Ok(bytes_read) => bytes_read,
            Err(e) => {
                error!("Error reading bytes: {}", e);
                continue;
            }
        };

        if bytes_read == 0 {
            continue;
        }
        let match_pattern = [0x3, b'\r', b'\n'];

        state.serial.data.extend_from_slice(&response);
        if response.starts_with(&match_pattern) {
            match app_clone.emit_all("serial_command", ()) {
                Ok(_) => {}
                Err(e) => {
                    error!("Error sending serial_command event: {}", e);
                }
            }
        }
    })
}

pub fn current_window_thread(
    app_handle: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<FDState>>,
) -> JoinHandle<()> {
    let state = state_ref.clone();
    let app_handle = app_handle.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(80));

        if let Ok(window_title) =
            get_current_window(|path| app_handle.path_resolver().resolve_resource(path))
        {
            state.lock().expect("mutex poisened").current_window = window_title;
        }
    })
}

pub fn system_temps_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<FDState>>,
) -> JoinHandle<()> {
    let state = state_ref.clone();
    let app_clone = app_handle_ref.clone();
    thread::spawn(move || {
        let mut sys = match fd_lib::system::SystemInfo::new() {
            Ok(sys) => sys,
            Err(e) => {
                error!("Error getting system info: {}", e);
                return;
            }
        };

        state.lock().expect("mutex poisened").sensors = sys.list_sensors();

        loop {
            thread::sleep(Duration::from_millis(1000));
            let temps = serde_json::json!({
                "cpuTemp": sys.cpu_temp(),
                "gpuTemp": sys.gpu_temp()
            });
            if let Err(e) = app_clone.app_handle().emit_all("system_temps", temps) {
                error!("Error sending system_temps event: {}", e);
            }
        }
    })
}
