use super::state::FDState;
use enigo::{Enigo, KeyboardControllable};
use std::sync::{Arc, Mutex};
use tauri::{Manager, State, Window};
use tauri_macros::command;

#[command]
pub fn get_ports(state: State<Arc<Mutex<FDState>>>) -> Result<Vec<String>, String> {
    let state = state.lock().expect("mutex poisened");
    Ok(state
        .serial
        .get_ports()
        .map_err(|e| e.to_string())?
        .iter()
        .map(|p| p.into())
        .collect())
}

#[command]
pub fn open(state: State<Arc<Mutex<FDState>>>, path: String, baud_rate: u32) -> Result<(), String> {
    let mut state = state.lock().expect("mutex poisened");
    state
        .serial
        .connect(path, baud_rate)
        .map_err(|e| e.to_string())
}
#[command]
pub fn close(state: State<Arc<Mutex<FDState>>>) {
    let mut state = state.lock().expect("mutex poisened");
    state.serial.disconnect();
}
#[command]
pub fn flush(state: State<Arc<Mutex<FDState>>>) {
    let mut state = state.lock().expect("mutex poisened");
    state.serial.data = Vec::new();
}
#[command]
pub fn write(state: State<Arc<Mutex<FDState>>>, data: Vec<u8>) -> Result<(), String> {
    let mut state = state.lock().expect("mutex poisened");
    state.serial.write(data).map_err(|e| e.to_string())
}

#[command]
pub fn read(state: State<Arc<Mutex<FDState>>>) -> Vec<u8> {
    let mut state = state.lock().expect("mutex poisened");
    state.serial.read()
}

#[command]
pub fn read_line(state: State<Arc<Mutex<FDState>>>) -> Result<Vec<u8>, String> {
    let mut state = state.lock().expect("mutex poisened");
    state.serial.read_line().map_err(|e| e.to_string())
}

#[command]
pub fn press_keys(_state: State<Arc<Mutex<FDState>>>, key_string: String) {
    let mut enigo = Enigo::new();
    enigo.key_sequence(&key_string);
}

#[command]
pub fn get_current_window(state: State<Arc<Mutex<FDState>>>) -> String {
    let state = state.lock().expect("mutex poisened");
    state.current_window.clone()
}

#[command]
pub fn list_sensors(state: State<Arc<Mutex<FDState>>>) -> Vec<String> {
    let state = state.lock().expect("mutex poisened");
    state.sensors.clone()
}

#[command]
pub fn set_aps_state(window: Window, aps_state: bool) -> Result<(), String> {
    let aps_item = window.app_handle().tray_handle().get_item("aps");
    aps_item.set_selected(aps_state).map_err(|e| e.to_string())
}
