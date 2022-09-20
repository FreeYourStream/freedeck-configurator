#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
mod modules;

use std::sync::{Arc, Mutex};

use fd_lib::{serial::FDSerial, state::FDState};
use modules::{commands, event_handlers, plugins::single_instance, threads};

use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem};

use tauri_macros::generate_handler;

fn main() {
    #[cfg(target_os = "macos")]
    macos_app_nap::prevent();

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let updates = CustomMenuItem::new("updates".to_string(), "Check for updates");
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
        serial: FDSerial::new(),
        current_window: "".to_string(),
    }));

    #[allow(unused_mut)] // needed for macos
    let mut app = tauri::Builder::default()
        .plugin(single_instance::init())
        .system_tray(tray)
        .on_system_tray_event(event_handlers::handle_tray_event)
        .manage(state.clone())
        .invoke_handler(generate_handler!(
            commands::get_ports,
            commands::open,
            commands::close,
            commands::flush,
            commands::write,
            commands::read,
            commands::read_line,
            commands::get_current_window,
            commands::set_aps_state,
            commands::press_keys
        ))
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "linux")]
    if app.handle().env().appimage.is_none() {
        app.tray_handle()
            .get_item("updates")
            .set_enabled(false)
            .unwrap();
        app.tray_handle()
            .get_item("updates")
            .set_title("Platform does not support updates")
            .unwrap();
    }

    #[cfg(target_os = "macos")]
    app.set_activation_policy(tauri::ActivationPolicy::Regular);

    let ports_join = threads::ports_thread(&app.handle(), &state);
    let read_join = threads::read_thread(&app.handle(), &state);
    let current_window_join = threads::current_window_thread(&app.handle(), &state);
    let system_temps_join = threads::system_temps_thread(&app.handle());

    app.run(event_handlers::handle_tauri_event);

    ports_join.join().unwrap();
    read_join.join().unwrap();
    current_window_join.join().unwrap();
    system_temps_join.join().unwrap();
}
