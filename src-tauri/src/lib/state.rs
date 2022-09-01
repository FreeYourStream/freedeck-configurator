use super::serial::FDSerial;
use super::system::SystemInfo;
pub struct FDState {
    pub serial: FDSerial,
    pub current_window: String,
    pub system_info: SystemInfo,
}
