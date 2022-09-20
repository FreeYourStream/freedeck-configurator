#[cfg(target_family = "windows")]
pub mod win;
#[cfg(target_family = "windows")]
pub use win::SystemInfo;

#[cfg(target_os = "unix")]
pub mod nix;
#[cfg(target_os = "unix")]
pub use nix::SystemInfo;
