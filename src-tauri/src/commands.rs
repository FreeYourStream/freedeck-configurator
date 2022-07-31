use crate::FDState;
use enigo::{Enigo, KeyboardControllable};
use serialport::{SerialPort, SerialPortType};
use std::{
    sync::{Arc, Mutex},
    time::Duration,
};
use tauri::{Manager, State, Window};
use tauri_macros::command;

pub struct Port {
    pub path: String,
    pub name: String,
}

impl Into<String> for &Port {
    fn into(self) -> String {
        format!("{};{}", self.path, self.name)
    }
}

fn get_compatible_devices() -> Vec<Port> {
    let mut ports: Vec<Port> = Vec::new();
    for port in serialport::available_ports().unwrap() {
        if let SerialPortType::UsbPort(info) = port.port_type {
            if (info.vid == 0xf1f0 && info.pid == 0x4005)
                || (info.vid == 0x2341 && info.pid == 0x8036)
                || (info.vid == 0x2341 && info.pid == 0x8037)
            {
                ports.push(Port {
                    name: info.product.unwrap_or("unknown".to_string()),
                    path: port.port_name.clone(),
                });
            }
        }
    }
    ports
}
pub struct Serial {
    pub port: Option<Box<dyn SerialPort>>,
    pub data: Vec<u8>,
}

impl Serial {
    pub fn new() -> Self {
        Serial {
            port: None,
            data: Vec::new(),
        }
    }
    pub fn get_ports(&self) -> Vec<Port> // returns vector of all avaliable serial ports
    {
        get_compatible_devices()
    }
    pub fn disconnect(&mut self) {
        self.port = None;
    }
    pub fn connect(&mut self, path: String, baud_rate: u32) -> Result<(), String> // opens serial port
    {
        let (clean_port, _) = path.split_once(";").unwrap();
        match self.port.as_ref() {
            Some(port) => {
                if port.name().unwrap_or("unknown".to_string()) == clean_port {
                    return Ok(());
                }
            }
            None => {}
        }
        let mut port = match serialport::new(clean_port.clone(), baud_rate).open() {
            Ok(port) => port,
            Err(e) => return Err(e.to_string()),
        };
        port.write_data_terminal_ready(true).unwrap();
        port.set_timeout(Duration::from_millis(50))
            .expect("error setting timeout");
        self.port = Some(port);
        Ok(())
    }
    pub fn write(&mut self, data: Vec<u8>) -> Result<(), Box<dyn std::error::Error>> // sends command to serial port
    {
        let port = self.port.as_mut().unwrap();
        port.write_all(&data)?;
        port.flush()?;
        Ok(())
    }
    pub fn read(&mut self) -> Result<Vec<u8>, Box<dyn std::error::Error>> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        self.data.clear();
        Ok(data)
    }
    pub fn read_line(&mut self) -> Result<Vec<u8>, String> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        if data.len() < 2 {
            return Err("Not enough data".into());
        }
        for index in 0..data.len() - 1 {
            let r = data[index];
            let n = data[index + 1];
            if r == b'\r' && n == b'\n' {
                let data = self.data.drain(0..index + 2).collect::<Vec<u8>>();
                return Ok(data);
            }
        }
        Err("No Line Found".into())
    }
}
#[command]
pub fn get_ports(state: State<Arc<Mutex<FDState>>>) -> Vec<String> {
    state
        .lock()
        .unwrap()
        .serial
        .get_ports()
        .iter()
        .map(|p| p.into())
        .collect()
}

#[command]
pub fn open(state: State<Arc<Mutex<FDState>>>, path: String, baud_rate: u32) -> Result<(), String> {
    state.lock().unwrap().serial.connect(path, baud_rate).into()
}
#[command]
pub fn close(state: State<Arc<Mutex<FDState>>>) {
    state.lock().unwrap().serial.disconnect();
}
#[command]
pub fn write(state: State<Arc<Mutex<FDState>>>, data: Vec<u8>) {
    state
        .lock()
        .unwrap()
        .serial
        .write(data)
        .expect("failed to send command");
}

#[command]
pub fn read(state: State<Arc<Mutex<FDState>>>) -> Vec<u8> {
    state
        .lock()
        .unwrap()
        .serial
        .read()
        .expect("failed to receive response")
}

#[command]
pub fn read_line(state: State<Arc<Mutex<FDState>>>) -> Result<Vec<u8>, String> {
    state.lock().unwrap().serial.read_line()
}

#[command]
pub fn press_keys(_state: State<Arc<Mutex<FDState>>>, key_string: String) -> Result<(), ()> {
    let mut enigo = Enigo::new();
    enigo.key_sequence(&key_string);
    Ok(())
}

#[command]
#[cfg(windows)]
pub fn get_current_window(_state: State<Arc<Mutex<FDState>>>) -> String {
    use std::{ffi::OsString, os::windows::prelude::OsStringExt};
    use winapi::um::winuser::{GetForegroundWindow, GetWindowTextW};

    unsafe {
        let window = GetForegroundWindow();
        let mut text: [u16; 512] = [0; 512];
        let _result = GetWindowTextW(window, text.as_mut_ptr(), text.len() as i32);
        OsString::from_wide(&text).to_str().unwrap().to_string()
    }
}
#[command]
#[cfg(target_os = "linux")]
pub fn get_current_window(_state: State<Arc<Mutex<FDState>>>) -> Result<String, String> {
    use std::process::Command;
    let mut command = Command::new("sh");
    command
        .arg("-c")
        .arg(include_str!("./linux_active_window.sh"));

    let output = command.output().expect("failed to execute process");
    let result = String::from_utf8(output.stdout).unwrap();
    let success = result.trim().len() > 0;

    if success {
        Ok(result)
    } else {
        Err("failed to get active window, xprop installed?".to_string())
    }
}
#[command]
#[cfg(target_os = "macos")]
pub fn get_current_window(state: State<Arc<Mutex<FDState>>>) -> String {
    state.lock().unwrap().current_window.clone()
}
#[command]
pub fn set_aps_state(window: Window, aps_state: bool) {
    let aps_item = window.app_handle().tray_handle().get_item("aps");
    aps_item.set_selected(aps_state).unwrap();
}
