use tauri::{Runtime, Window};

pub fn show<R: Runtime>(window: Window<R>) {
    window.hide().unwrap(); // fix for gnome
    window.set_focus().unwrap();
    window.show().unwrap();
    window.unminimize().unwrap();
}
