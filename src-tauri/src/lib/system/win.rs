use anyhow::Result;
use std::collections::HashMap;
use wmi::*;

// struct SaveCOM(COMLibrary);
// unsafe impl Send for SaveCOM {}

pub struct SystemInfo {
    sys: WMIConnection,
}

impl SystemInfo {
    pub fn new() -> Result<SystemInfo> {
        let lib = COMLibrary::new()?;
        let connection = WMIConnection::with_namespace_path("root\\OpenHardwareMonitor", lib)?;
        Ok(SystemInfo { sys: connection })
    }
    pub fn cpu_temp(&mut self) -> f32 {
        let cpu_results: Result<Vec<HashMap<String, Variant>>, WMIError> =
        self.sys.raw_query("SELECT * FROM Sensor where Identifier = '/amdcpu/0/temperature/0' or Identifier = '/intelcpu/0/temperature/0' AND SensorType = 'Temperature'");

        let cpu_results = match cpu_results {
            Ok(result) => result,
            Err(_e) => return 0.0,
        };

        if cpu_results.is_empty() {
            0.0
        } else {
            let cpu = &cpu_results[0];
            if let Some(Variant::R4(value)) = cpu.get("Value") {
                value.to_owned()
            } else {
                0.0
            }
        }
    }
    pub fn gpu_temp(&mut self) -> f32 {
        let gpu_results: Result<Vec<HashMap<String, Variant>>, WMIError> =
        self.sys.raw_query("SELECT * FROM Sensor where Identifier = '/atigpu/0/temperature/0' or Identifier = '/nvidiagpu/0/temperature/0' AND SensorType = 'Temperature'");

        let gpu_results = match gpu_results {
            Ok(result) => result,
            Err(_e) => return 0.0,
        };

        if gpu_results.is_empty() {
            0.0
        } else {
            let cpu = &gpu_results[0];
            if let Some(Variant::R4(value)) = cpu.get("Value") {
                value.to_owned()
            } else {
                0.0
            }
        }
    }
    pub fn list_sensors(&mut self) -> Vec<String> {
        let sensor_list_result: Vec<HashMap<String, Variant>> = match self
            .sys
            .raw_query("SELECT * FROM Sensor where SensorType='Temperature'")
        {
            Ok(result) => result,
            Err(e) => return vec![e.to_string()],
        };

        sensor_list_result
            .iter()
            .filter_map(|s| match s.get("Identifier") {
                Some(Variant::String(value)) => Some(value.clone()),
                _ => None,
            })
            .collect()
    }
}
