#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
pub mod commands;
mod lib;
mod plugins;
use std::{
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};

use crate::commands::*;
use tauri_macros::generate_handler;

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let mut aps_enabled = CustomMenuItem::new("aps".to_string(), "Auto page-switcher");
    aps_enabled.selected = true;

    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(aps_enabled)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);
    let serial = Arc::new(Mutex::new(Serial::new()));
    let thread_serial = serial.clone();

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

    let thread_app = app.handle().clone();
    let thread_join = thread::spawn(move || {
        let mut ports = Vec::new();
        loop {
            let new_ports = thread_serial.lock().unwrap().get_ports();
            if new_ports.len() != ports.len() {
                let new_ports_str: Vec<String> = new_ports
                    .iter()
                    .map(|p| format!("{};{}", p.path, p.name))
                    .collect();
                thread_app.emit_all("ports_changed", new_ports_str).unwrap();
            }
            ports = new_ports;
            thread::sleep(Duration::from_millis(200));
        }
    });

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
        }
        _ => {}
    });
    thread_join.join().unwrap();
}
