use std::{
    sync::{Arc, Mutex},
    thread::{self, JoinHandle},
    time::Duration,
};

use fd_lib::{
    os::{get_current_window, refresh_ports},
    state::FDState,
};
use tauri::{AppHandle, Manager, Wry};
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
            ports = refresh_ports(&state_ref, ports.len(), |ports_string| {
                app_clone
                    .app_handle()
                    .emit_all("ports_changed", ports_string)
                    .unwrap();
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

        let mut state = state.lock().unwrap();
        let available = match state.serial.port.as_ref() {
            Some(port) => port.bytes_to_read().unwrap_or(0),
            None => {
                continue;
            }
        };

        if available == 0 {
            continue;
        }

        let mut response = vec![0; available.try_into().unwrap()];

        let amount = state
            .serial
            .port
            .as_mut()
            .unwrap()
            .read(&mut response)
            .unwrap_or(0);
        if amount == 0 {
            continue;
        }
        let match_pattern = [0x3, b'\r', b'\n'];

        state.serial.data.extend_from_slice(&response);
        match response.starts_with(&match_pattern) {
            true => app_clone.emit_all("serial_command", ()).unwrap(),
            false => {}
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

        if let Some(window_title) =
            get_current_window(|path| app_handle.path_resolver().resolve_resource(path))
        {
            state.lock().unwrap().current_window = window_title;
        }
    })
}

pub fn system_temps_thread(
    app_handle_ref: &AppHandle<Wry>,
    state: &Arc<Mutex<FDState>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let state = state.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(500));
        let temps = serde_json::json!({
            "cpuTemp": state.lock().unwrap().system_info.cpu_temp(),
            "gpuTemp": state.lock().unwrap().system_info.gpu_temp()
        });
        app_clone
            .app_handle()
            .emit_all("system_temps", temps)
            .unwrap();
    })
}
