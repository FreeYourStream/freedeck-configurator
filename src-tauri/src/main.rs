#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
pub mod commands;
mod lib;
mod plugins;
use std::sync::Mutex;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayHandle, SystemTrayMenu,
    SystemTrayMenuItem, WindowEvent,
};

use crate::commands::*;
use tauri_macros::generate_handler;

struct FD_State {
    serial: Mutex<Serial>,
    tray: SystemTrayHandle,
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let aps_enabled = CustomMenuItem::new("aps".to_string(), "Auto page-switcher");

    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(aps_enabled)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    let serial = Mutex::new(Serial::new());

    let mut app = tauri::Builder::default()
        .plugin(plugins::single_instance::init())
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                lib::window::show(window);
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "aps" => app.emit_all("toggle_aps", ()).unwrap(),
                "show" => {
                    let window = app.get_window("main").unwrap();
                    lib::window::show(window)
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
            get_current_window,
            set_aps_state
        ))
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Regular);
    app.tray_handle().get_item("aps").set_enabled(true).unwrap();
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
