use crate::FDState;
use enigo::{Enigo, KeyboardControllable};
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Window};
use tauri_macros::command;

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
    state.lock().unwrap().serial.connect(path, baud_rate)
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
pub fn press_keys(_state: State<Arc<Mutex<FDState>>>, key_string: String) {
    let mut enigo = Enigo::new();
    enigo.key_sequence(&key_string);
}

#[command]
pub fn get_current_window(state: State<Arc<Mutex<FDState>>>) -> String {
    state.lock().unwrap().current_window.clone()
}
#[command]
pub fn set_aps_state(window: Window, aps_state: bool) {
    let aps_item = window.app_handle().tray_handle().get_item("aps");
    aps_item.set_selected(aps_state).unwrap();
}
