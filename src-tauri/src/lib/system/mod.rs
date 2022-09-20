#[cfg(target_family = "windows")]
pub mod win;
#[cfg(target_family = "windows")]
pub use win::SystemInfo;

#[cfg(not(target_os = "windows"))]
pub mod nix;
#[cfg(not(target_os = "windows"))]
pub use nix::SystemInfo;
