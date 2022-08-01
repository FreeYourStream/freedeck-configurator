use std::{
    sync::{Arc, Mutex},
    thread::{self, JoinHandle},
    time::Duration,
};

use tauri::{AppHandle, Manager, Wry};

#[cfg(target_os = "macos")]
pub fn current_window_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<crate::FDState>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let state = state_ref.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(250));

        use std::process::Command;
        let script_location = app_clone
            .path_resolver()
            .resolve_resource("./src/macos_active_window.as")
            .unwrap();
        let mut command = Command::new("sh");

        command.arg("-c").arg(format!(
            "osascript {}",
            script_location.as_path().to_str().unwrap()
        ));

        let output = command.output().unwrap();
        let result = String::from_utf8(output.stdout).unwrap();
        let success = result.trim().len() > 0;

        if success {
            state.lock().unwrap().current_window = result;
        } else {
            println!("failed to get active window, remove and readd freedeck-configurator to accessibility list?")
        }
    })
}

#[cfg(target_os = "linux")]
pub fn current_window_thread(
    _app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<crate::FDState>>,
) -> JoinHandle<()> {
    use std::process::Command;
    let state = state_ref.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(80));

        let mut command = Command::new("sh");
        command
            .arg("-c")
            .arg(include_str!("../linux_active_window.sh"));

        let output = command.output().expect("failed to execute process");
        let result = String::from_utf8(output.stdout).unwrap();
        let success = result.trim().len() > 0;

        if success {
            state.lock().unwrap().current_window = result;
        } else {
            println!("failed to get active window, xprop installed?")
        }
    })
}

#[cfg(target_os = "windows")]
pub fn current_window_thread(
    _app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<crate::FDState>>,
) -> JoinHandle<()> {
    use std::{ffi::OsString, os::windows::prelude::OsStringExt};
    use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};
    let state = state_ref.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(80));
        unsafe {
            let window = GetForegroundWindow();
            let mut text: [u16; 512] = [0; 512];
            let _result: usize =
                GetWindowTextW(window, text.as_mut_ptr(), text.len() as i32) as usize;
            let (short, _) = text.split_at(_result);
            state.lock().unwrap().current_window =
                OsString::from_wide(&short).to_str().unwrap().to_string();
        }
    })
}

pub fn ports_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<crate::FDState>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let state = state_ref.clone();
    thread::spawn(move || {
        let mut ports = Vec::new();
        loop {
            thread::sleep(Duration::from_millis(500));
            let state = state.lock().unwrap();
            let new_ports = state.serial.get_ports();
            if new_ports.len() != ports.len() {
                let new_ports_str = new_ports.iter().map(|p| p.into()).collect::<Vec<String>>();
                app_clone.emit_all("ports_changed", new_ports_str).unwrap();
            }
            ports = new_ports;
        }
    })
}

pub fn read_thread(
    app_handle_ref: &AppHandle<Wry>,
    state_ref: &Arc<Mutex<crate::FDState>>,
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

        state
            .serial
            .port
            .as_mut()
            .unwrap()
            .read(&mut response)
            .unwrap_or_else(|_e| 0);
        let match_pattern = [0x3, b'\r', b'\n'];

        state.serial.data.extend_from_slice(&response);
        match response.starts_with(&match_pattern) {
            true => app_clone.emit_all("serial_command", ()).unwrap(),
            false => {}
        }
    })
}
