use tauri::{AppHandle, Manager, RunEvent, SystemTrayEvent, WindowEvent};

use super::window;

pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("main").unwrap();
            window::show(window)
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "aps" => app.emit_all("toggle_aps", ()).unwrap(),
            "show" => {
                let window = app.get_window("main").unwrap();
                window::show(window)
            }
            _ => {}
        },
        _ => {}
    }
}

pub fn handle_tauri_event(app_handle: &AppHandle, e: RunEvent) {
    match e {
        tauri::RunEvent::WindowEvent { label, event, .. } => {
            let app_handle = app_handle.clone();
            let window = app_handle.get_window(&label).unwrap();
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    window.hide().unwrap();
                }
                _ => {}
            }
        }
        _ => {}
    }
}
