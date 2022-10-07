use log::error;
use tauri::{Runtime, Window};

pub fn show<R: Runtime>(window: Window<R>) {
    window
        .hide()
        .unwrap_or_else(|e| error!("Error hiding window: {}", e));
    window
        .set_focus()
        .unwrap_or_else(|e| error!("Error setting focus: {}", e));
    window
        .show()
        .unwrap_or_else(|e| error!("Error showing window: {}", e));
    window
        .unminimize()
        .unwrap_or_else(|e| error!("Error unminimizing window: {}", e));
}
