use std::{
    path::PathBuf,
    sync::{Arc, Mutex},
};

use crate::{serial::Port, state::FDState};

#[cfg(target_os = "macos")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    resolve_resource: F,
) -> Option<String> {
    use std::process::Command;
    let script_location = resolve_resource("./src/assets/macos_active_window.as").unwrap();
    let mut command = Command::new("sh");

    command.arg("-c").arg(format!(
        "osascript {}",
        script_location.as_path().to_str().unwrap()
    ));

    let output = command.output().unwrap();
    let result = String::from_utf8(output.stdout).unwrap();
    let success = result.trim().len() > 0;

    if success {
        return Some(result);
    }
    println!("failed to get active window, remove and readd freedeck-configurator to accessibility list?");
    return None;
}

#[cfg(target_os = "linux")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    _resolve_resource: F,
) -> Option<String> {
    use std::process::Command;

    let mut command = Command::new("sh");
    command
        .arg("-c")
        .arg(include_str!("../assets/linux_active_window.sh"));

    let output = command.output().expect("failed to execute process");
    let result = String::from_utf8(output.stdout).unwrap();
    let success = !result.trim().is_empty();

    if success {
        return Some(result);
    }
    None
}

#[cfg(target_os = "windows")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    _resolve_resource: F,
) -> Option<String> {
    use std::{ffi::OsString, os::windows::prelude::OsStringExt};
    use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};
    unsafe {
        let window = GetForegroundWindow();
        let mut text: [u16; 512] = [0; 512];
        let _result: usize = GetWindowTextW(window, text.as_mut_ptr(), text.len() as i32) as usize;
        let (short, _) = text.split_at(_result);
        let result = OsString::from_wide(&short).to_str().unwrap().to_string();
        let success = result.trim().len() > 0;
        if success {
            return Some(OsString::from_wide(&short).to_str().unwrap().to_string());
        }
    }
    None
}

pub fn refresh_ports<CB: FnOnce(Vec<String>)>(
    state: &Arc<Mutex<FDState>>,
    port_len: usize,
    on_change: CB,
) -> Vec<Port> {
    let mut state = state.lock().unwrap();
    let new_ports = state.serial.get_ports();
    if new_ports.len() != port_len {
        let new_ports_str = new_ports.iter().map(|p| p.into()).collect::<Vec<String>>();
        on_change(new_ports_str);
        if let Some(port) = state.serial.port.as_ref() {
            let old_name = port.name().unwrap();
            let found = new_ports.iter().find(|port| port.path == old_name);
            if found.is_none() {
                state.serial.data.truncate(0);
            }
        }
    }
    new_ports
}
