use std::time::Duration;

use serialport::{SerialPort, SerialPortType};
#[derive(Debug)]
pub struct Port {
    pub path: String,
    pub name: String,
}
impl From<&Port> for String {
    fn from(port: &Port) -> String {
        format!("{};{}", port.path, port.name)
    }
}

#[derive(Default)]
pub struct FDSerial {
    pub port: Option<Box<dyn SerialPort>>,
    pub data: Vec<u8>,
}

impl FDSerial {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn get_ports(&self) -> Vec<Port> // returns vector of all avaliable serial ports
    {
        let mut ports: Vec<Port> = Vec::new();
        for port in serialport::available_ports().unwrap() {
            if let SerialPortType::UsbPort(info) = port.port_type {
                if (info.vid == 0xf1f0 && info.pid == 0x4005)
                    || (info.vid == 0x2341 && info.pid == 0x8036)
                    || (info.vid == 0x2341 && info.pid == 0x8037)
                {
                    ports.push(Port {
                        name: info.product.unwrap_or_else(|| "unknown".to_string()),
                        path: port.port_name.clone(),
                    });
                }
            }
        }
        ports
    }
    pub fn disconnect(&mut self) {
        self.port = None;
    }
    pub fn connect(&mut self, path: String, baud_rate: u32) -> Result<(), String> // opens serial port
    {
        let (clean_port, _) = path.split_once(';').unwrap();
        match self.port.as_ref() {
            Some(port) => {
                if port.name().unwrap_or_else(|| "unknown".to_string()) == clean_port {
                    return Ok(());
                }
            }
            None => {}
        }
        let mut port = match serialport::new(clean_port, baud_rate).open() {
            Ok(port) => port,
            Err(e) => return Err(e.to_string()),
        };
        port.write_data_terminal_ready(true).unwrap();
        port.set_timeout(Duration::from_millis(50))
            .expect("error setting timeout");
        self.port = Some(port);
        Ok(())
    }
    pub fn write(&mut self, data: Vec<u8>) -> Result<(), Box<dyn std::error::Error>> // sends command to serial port
    {
        let port = self.port.as_mut().unwrap();
        port.write_all(&data)?;
        port.flush()?;
        Ok(())
    }
    pub fn read(&mut self) -> Result<Vec<u8>, Box<dyn std::error::Error>> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        self.data.clear();
        Ok(data)
    }
    pub fn read_line(&mut self) -> Result<Vec<u8>, String> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        if data.len() < 2 {
            return Err("Not enough data".into());
        }
        for index in 0..data.len() - 1 {
            let r = data[index];
            let n = data[index + 1];
            if r == b'\r' && n == b'\n' {
                let data = self.data.drain(0..index + 2).collect::<Vec<u8>>();
                return Ok(data);
            }
        }
        Err("No Line Found".into())
    }
}
