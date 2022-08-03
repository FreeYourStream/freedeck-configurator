use std::sync::{Arc, Mutex};

use tauri::{
    api::dialog, AppHandle, Manager, RunEvent, SystemTrayEvent, UpdaterEvent, Window, WindowEvent,
};

use crate::FDState;

use super::window;

async fn handle_update(app_handle: AppHandle, window: Window) {
    match app_handle.updater().check().await {
        Ok(update) => {
            if !update.is_update_available() {
                return;
            }
            #[cfg(target_os = "linux")]
            {
                if app_handle.env().appimage.is_none() {
                    return;
                }
            }
            dialog::confirm(
                Some(&window),
                "Update available",
                format!(
                    "Update to version {}?\nYou have version {}",
                    update.latest_version(),
                    update.current_version()
                ),
                |confirmed| {
                    if confirmed {
                        tauri::async_runtime::spawn(async { update.download_and_install().await });
                    }
                },
            )
        }
        Err(e) => {
            println!("error checking for update: {}", e);
        }
    };
}

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
                app.exit(0);
            }
            "aps" => app.emit_all("toggle_aps", ()).unwrap(),
            "show" => {
                let window = app.get_window("main").unwrap();
                window::show(window)
            }
            "updates" => {
                app.state::<Arc<Mutex<FDState>>>()
                    .lock()
                    .unwrap()
                    .serial
                    .port
                    .take();
                let window = app.get_window("main").unwrap();
                let app_handle = app.clone();
                tauri::async_runtime::spawn(async { handle_update(app_handle, window).await });
            }
            _ => {}
        },
        _ => {}
    }
}

pub fn handle_tauri_event(app_handle: &AppHandle, e: RunEvent) {
    let app_handle = app_handle.clone();
    match e {
        tauri::RunEvent::Ready => {
            let window = app_handle.get_window("main").unwrap();
            tauri::async_runtime::spawn(async { handle_update(app_handle, window).await });
        }
        tauri::RunEvent::WindowEvent { label, event, .. } => match event {
            WindowEvent::CloseRequested { api, .. } => {
                let window = app_handle.get_window(&label).unwrap();
                api.prevent_close();
                window.hide().unwrap();
            }
            _ => (),
        },
        tauri::RunEvent::Updater(update_event) => match update_event {
            UpdaterEvent::Error(e) => {
                println!("updater error: {}", e);
            }
            UpdaterEvent::Updated => {
                app_handle
                    .state::<Arc<Mutex<FDState>>>()
                    .lock()
                    .unwrap()
                    .serial
                    .port
                    .take();
                app_handle.restart();
            }
            _ => (),
        },
        _ => (),
    }
}
