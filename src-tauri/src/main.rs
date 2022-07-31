#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
pub mod commands;
mod lib;
mod plugins;
use lib::{
    event_handlers::{handle_tauri_event, handle_tray_event},
    threads,
};
use std::sync::{Arc, Mutex};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayMenuItem};

use crate::commands::*;
use tauri_macros::generate_handler;

pub struct FDState {
    serial: Serial,
    current_window: String,
}

fn main() {
    #[cfg(target_os = "macos")]
    macos_app_nap::prevent();

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let updates = CustomMenuItem::new("updates".to_string(), "Restart & check for updates");
    let mut aps_enabled = CustomMenuItem::new("aps".to_string(), "Auto page-switcher");
    aps_enabled.selected = true;

    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(aps_enabled)
        .add_item(updates)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);

    let state = Arc::new(Mutex::new(FDState {
        serial: Serial::new(),
        current_window: "".to_string(),
    }));

    #[allow(unused_mut)] // needed for macos
    let mut app = tauri::Builder::default()
        .plugin(plugins::single_instance::init())
        .system_tray(tray)
        .on_system_tray_event(handle_tray_event)
        .manage(state.clone())
        .invoke_handler(generate_handler!(
            get_ports,
            open,
            close,
            write,
            read,
            read_line,
            get_current_window,
            set_aps_state,
            press_keys
        ))
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Regular);

    let ports_join = threads::ports_thread(&app.handle(), &state);
    let read_join = threads::read_thread(&app.handle(), &state);
    let current_window_join = threads::current_window_thread(&app.handle(), &state);

    app.run(handle_tauri_event);
    ports_join.join().unwrap();
    read_join.join().unwrap();
    current_window_join.join().unwrap();
}
