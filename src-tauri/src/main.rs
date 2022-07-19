#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod commands;
use std::sync::Mutex;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};

use crate::commands::*;
use tauri_macros::generate_handler;

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    let serial = Mutex::new(Serial::new());

    let mut app = tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
                window.request_user_attention(None).unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.unminimize().unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                    window.request_user_attention(None).unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .manage(serial)
        .invoke_handler(generate_handler!(
            get_ports,
            open,
            close,
            write,
            read,
            get_current_window
        ))
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Regular);

    app.run(|app_handle, e| match e {
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

            // // ask the user if he wants to quit
            // ask(
            //     Some(&window),
            //     "Tauri API",
            //     "Are you sure that you want to close this window?",
            //     move |answer| {
            //         if answer {
            //             // .close() cannot be called on the main thread
            //             std::thread::spawn(move || {
            //                 app_handle.get_window(&label).unwrap().close().unwrap();
            //             });
            //         }
            //     },
            // );
        }
        _ => {}
    });
}
