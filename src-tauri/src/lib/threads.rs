use std::{
    sync::{Arc, Mutex},
    thread::{self, JoinHandle},
    time::Duration,
};

use tauri::{AppHandle, Manager, Wry};

use crate::commands::Serial;

pub fn ports_thread(
    app_handle_ref: &AppHandle<Wry>,
    serial_ref: &Arc<Mutex<Serial>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let serial_clone = serial_ref.clone();
    thread::spawn(move || {
        let mut ports = Vec::new();
        loop {
            thread::sleep(Duration::from_millis(500));
            let serial = serial_clone.lock().unwrap();
            let new_ports = serial.get_ports();
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
    serial_ref: &Arc<Mutex<Serial>>,
) -> JoinHandle<()> {
    let app_clone = app_handle_ref.clone();
    let serial_clone = serial_ref.clone();
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(10));

        let mut serial = serial_clone.lock().unwrap();
        let available = match serial.port.as_ref() {
            Some(port) => port.bytes_to_read().unwrap_or(0),
            None => {
                continue;
            }
        };

        if available == 0 {
            continue;
        }

        let mut response = vec![0; available.try_into().unwrap()];

        serial
            .port
            .as_mut()
            .unwrap()
            .read(&mut response)
            .unwrap_or_else(|_e| 0);
        let match_pattern = [0x3, b'\r', b'\n'];

        match response.starts_with(&match_pattern) {
            true => app_clone.emit_all("serial_command", ()).unwrap(),
            false => {}
        }

        serial.data.extend_from_slice(&response);
    })
}
