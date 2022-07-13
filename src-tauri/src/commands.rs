use std::{sync::Mutex, time::Duration};

use mio_serial::SerialPort;
use tauri::State;
use tauri_macros::command;

fn get_epoch() -> u128 {
    let now = std::time::SystemTime::now();
    now.duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis()
}
pub struct Serial {
    port: Option<Mutex<Box<dyn SerialPort>>>,
}

impl Serial {
    pub fn new() -> Self {
        Serial { port: None }
    }
    pub fn get_ports(&self) -> Vec<String> // returns vector of all avaliable serial ports
    {
        let mut ports: Vec<String> = Vec::new();
        for port in mio_serial::available_ports().unwrap() {
            ports.push(port.port_name.clone());
        }
        ports
    }
    pub fn connect(&mut self, path: String, baud_rate: u32) // opens serial port
    {
        let mut port = mio_serial::new(path.clone(), baud_rate)
            .open()
            .expect("error opening serial port");
        port.set_timeout(Duration::from_millis(1000))
            .expect("error setting timeout");

        self.port = Some(Mutex::new(port));
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
    state.lock().unwrap().get_ports()
}

#[command]
pub fn open(state: State<Mutex<Serial>>, path: String, baud_rate: u32) {
    state.lock().unwrap().connect(path, baud_rate);
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
