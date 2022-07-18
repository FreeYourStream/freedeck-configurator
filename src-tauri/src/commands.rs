use std::{sync::Mutex, time::Duration};

use serialport::{SerialPort, SerialPortType};
use tauri::State;
use tauri_macros::command;

fn get_epoch() -> u128 {
    let now = std::time::SystemTime::now();
    now.duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis()
}

pub struct Port {
    path: String,
    name: String,
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
    port: Option<Mutex<Box<dyn SerialPort>>>,
}

impl Serial {
    pub fn new() -> Self {
        Serial { port: None }
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
                if port.lock().unwrap().name().unwrap_or("unknown".to_string()) == clean_port {
                    return Ok(());
                }
            }
            None => {}
        }
        let mut port = match serialport::new(clean_port.clone(), baud_rate).open() {
            Ok(port) => port,
            Err(e) => return Err(e.to_string()),
        };

        port.set_timeout(Duration::from_millis(1000))
            .expect("error setting timeout");
        self.port = Some(Mutex::new(port));
        Ok(())
    }
    pub fn write(&mut self, data: Vec<u8>) -> Result<(), Box<dyn std::error::Error>> // sends command to serial port
    {
        let mut port = self.port.as_mut().unwrap().lock().unwrap();
        port.write_all(&data)?;
        port.flush()?;
        Ok(())
    }
    pub fn read(&mut self) -> Result<Vec<u8>, Box<dyn std::error::Error>> // sends command to serial port and returns response
    {
        let mut port = self.port.as_mut().unwrap().lock().unwrap();
        let mut available = port.bytes_to_read().unwrap();
        let start = get_epoch();
        while available <= 0 && get_epoch() - start < 1000 {
            available = port.bytes_to_read().unwrap();
        }
        let mut response = vec![0; available.try_into().unwrap()];
        port.read(&mut response).unwrap_or_else(|_e| 0);
        Ok(response)
    }
}
#[command]
pub fn get_ports(state: State<Mutex<Serial>>) -> Vec<String> {
    state
        .lock()
        .unwrap()
        .get_ports()
        .iter()
        .map(|p| format!("{};{}", p.path, p.name))
        .collect()
}

#[command]
pub fn open(state: State<Mutex<Serial>>, path: String, baud_rate: u32) -> Result<(), String> {
    state.lock().unwrap().connect(path, baud_rate).into()
}
#[command]
pub fn close(state: State<Mutex<Serial>>) {
    state.lock().unwrap().disconnect();
}
#[command]
pub fn write(state: State<Mutex<Serial>>, data: Vec<u8>) {
    state
        .lock()
        .unwrap()
        .write(data)
        .expect("failed to send command");
}

#[command]
pub fn read(state: State<Mutex<Serial>>) -> Vec<u8> {
    state
        .lock()
        .unwrap()
        .read()
        .expect("failed to receive response")
}

#[command]
#[cfg(windows)]
pub fn get_current_window(_state: State<Mutex<Serial>>) -> String {
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
#[cfg(not(windows))]
pub fn get_current_window(_state: State<Mutex<Serial>>) -> Result<String, String> {
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
