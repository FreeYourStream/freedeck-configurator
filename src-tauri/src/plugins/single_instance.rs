use crate::lib::window;

use std::thread;
use tauri::{
    plugin::{Builder, TauriPlugin},
    AppHandle, Manager, Runtime,
};
use tiny_http::{Response, Server};
fn start_server<R: Runtime>(app_handle: AppHandle<R>) {
    thread::spawn(move || {
        let server = Server::http("localhost:57891").unwrap();
        for request in server.incoming_requests() {
            let response = Response::from_string("ok");
            match request.respond(response) {
                Ok(_) => println!("responded to request"),
                Err(e) => println!("failed to respond to request: {:?}", e),
            }
            let window = app_handle.get_window("main").unwrap();
            window::show(window);
        }
    });
}

/// Initializes the plugin.
#[must_use]
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("single-instance")
        .setup(|app_handle| {
            println!("{}", "Starting server...");
            match reqwest::blocking::get("http://localhost:57891/") {
                Ok(result) => {
                    println!("App already running {}", result.text().unwrap());
                    app_handle.exit(1);
                }
                Err(_) => start_server(app_handle.clone()),
            }
            Ok(())
        })
        .build()
}
