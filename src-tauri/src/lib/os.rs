use anyhow::{anyhow, Result};
use std::path::PathBuf;
#[cfg(target_os = "macos")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    resolve_resource: F,
) -> Result<String> {
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
        return Ok(result);
    }
    Err(anyhow!("failed to get active window, remove and readd freedeck-configurator to accessibility list?"))
}

#[cfg(target_os = "linux")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    _resolve_resource: F,
) -> Result<String> {
    use std::process::Command;

    let mut command = Command::new("sh");
    command
        .arg("-c")
        .arg(include_str!("../assets/linux_active_window.sh"));

    let output = command.output()?;
    let result = String::from_utf8(output.stdout)?;
    let success = !result.trim().is_empty();

    if !success {
        return Err(anyhow!("failed to get active window"));
    }
    Ok(result)
}

#[cfg(target_os = "windows")]
pub fn get_current_window<F: FnOnce(&str) -> Option<PathBuf>>(
    _resolve_resource: F,
) -> Result<String> {
    use std::{ffi::OsString, os::windows::prelude::OsStringExt};
    use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};
    unsafe {
        let window = GetForegroundWindow();
        let mut text: [u16; 512] = [0; 512];
        let _result: usize = GetWindowTextW(window, text.as_mut_ptr(), text.len() as i32) as usize;
        let (short, _) = text.split_at(_result);
        let result = OsString::from_wide(short)
            .to_str()
            .expect("os string conversion error")
            .to_string();
        let success = !result.trim().is_empty();
        if success {
            return Ok(OsString::from_wide(short)
                .to_str()
                .expect("os string conversion error")
                .to_string());
        }
    }
    Err(anyhow!("windows did an oopsy"))
}
