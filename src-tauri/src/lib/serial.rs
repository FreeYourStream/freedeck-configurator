use anyhow::{anyhow, Context, Result};
use serialport::{SerialPort, SerialPortType};
use std::time::Duration;
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
    pub fn refresh_ports<CB: FnOnce(Vec<String>)>(
        &mut self,
        port_len: usize,
        on_change: CB,
    ) -> Vec<Port> {
        let new_ports = match self.get_ports() {
            Ok(ports) => ports,
            Err(e) => {
                log::error!("Error getting ports: {}", e);
                return Vec::new();
            }
        };

        if new_ports.len() != port_len {
            let new_ports_str = new_ports.iter().map(|p| p.into()).collect::<Vec<String>>();
            on_change(new_ports_str);
            if let Some(port) = self.port.as_ref() {
                let old_name = port.name().unwrap_or_else(|| "Unknown".to_string());
                let found = new_ports.iter().find(|port| port.path == old_name);
                if found.is_none() {
                    self.data.truncate(0);
                }
            }
        }
        new_ports
    }
    pub fn get_ports(&self) -> Result<Vec<Port>> // returns vector of all avaliable serial ports
    {
        let mut ports: Vec<Port> = Vec::new();
        for port in serialport::available_ports()? {
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
        Ok(ports)
    }
    pub fn disconnect(&mut self) {
        self.port = None;
    }
    pub fn connect(&mut self, path: String, baud_rate: u32) -> Result<()> // opens serial port
    {
        let (clean_port, _) = path.split_once(';').unwrap_or((&path, ""));
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
            Err(e) => return Err(anyhow!(e)),
        };
        port.write_data_terminal_ready(true)?;
        port.set_timeout(Duration::from_millis(50))?;
        self.port = Some(port);
        Ok(())
    }
    pub fn write(&mut self, data: Vec<u8>) -> Result<()> // sends command to serial port
    {
        let port = self.port.as_mut().context("no port open")?;
        port.write_all(&data)?;
        port.flush()?;
        Ok(())
    }
    pub fn read(&mut self) -> Vec<u8> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        self.data.clear();
        data
    }
    pub fn read_line(&mut self) -> Result<Vec<u8>> // sends command to serial port and returns response
    {
        let data = self.data.clone();
        if data.len() < 2 {
            return Err(anyhow!("not enough data"));
        }
        for index in 0..data.len() - 1 {
            let r = data[index];
            let n = data[index + 1];
            if r == b'\r' && n == b'\n' {
                let data = self.data.drain(0..index + 2).collect::<Vec<u8>>();
                return Ok(data);
            }
        }
        Err(anyhow!("No Line Found"))
    }
}
