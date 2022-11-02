pub mod single_instance {

    use crate::modules::window;

    use log::info;
    use std::thread;
    use tauri::{
        plugin::{Builder, TauriPlugin},
        AppHandle, Manager, Runtime,
    };
    use tiny_http::{Response, Server};

    pub fn start_server<R: Runtime>(app_handle: AppHandle<R>) {
        thread::spawn(move || {
            let server = match Server::http("localhost:57891") {
                Ok(server) => server,
                Err(e) => {
                    println!("Error starting server on port 57891: {}", e);
                    return;
                }
            };
            for request in server.incoming_requests() {
                let response = Response::from_string("ok");
                match request.respond(response) {
                    Ok(_) => println!("responded to request"),
                    Err(e) => println!("failed to respond to request: {:?}", e),
                }
                let window = app_handle
                    .get_window("main")
                    .expect("main window not found");
                window::show(window);
            }
        });
    }

    /// Initializes the plugin.
    #[must_use]
    pub fn init<R: Runtime>() -> TauriPlugin<R> {
        Builder::new("single-instance")
            .setup(|app_handle| {
                println!("Starting server...");
                match reqwest::blocking::get("http://localhost:57891/") {
                    Ok(result) => {
                        info!(
                            "App already running: {}",
                            result
                                .text()
                                .unwrap_or_else(|e| format!("no response because of error: {}", e))
                        );
                        app_handle.exit(1);
                    }
                    Err(_) => start_server(app_handle.clone()),
                }
                Ok(())
            })
            .build()
    }
}
