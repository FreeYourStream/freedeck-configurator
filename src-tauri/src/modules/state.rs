use fd_lib::serial::FDSerial;

pub struct FDState {
    pub serial: FDSerial,
    pub current_window: String,
    pub sensors: Vec<String>,
}
