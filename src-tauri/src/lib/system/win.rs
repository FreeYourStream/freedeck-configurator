use std::{collections::HashMap, sync::Arc};

use wmi::*;

// struct SaveCOM(COMLibrary);
// unsafe impl Send for SaveCOM {}

pub struct SystemInfo {
    sys: WMIConnection,
}

impl SystemInfo {
    pub fn new() -> Option<SystemInfo> {
        match WMIConnection::with_namespace_path(
            "root\\OpenHardwareMonitor",
            COMLibrary::new().unwrap(),
        ) {
            Ok(sys) => Some(SystemInfo { sys }),
            Err(_) => None,
        }
    }
    pub fn cpu_temp(&mut self) -> f32 {
        let cpu_results: Vec<HashMap<String, Variant>> =
        self.sys.raw_query("SELECT * FROM Sensor where Identifier = '/amdcpu/0/temperature/0' or Identifier = '/intelcpu/0/temperature/0' AND SensorType = 'Temperature'").unwrap();
        if cpu_results.len() == 0 {
            0.0
        } else {
            let cpu = &cpu_results[0];
            if let Some(Variant::R4(value)) = cpu.get("Value") {
                value.clone()
            } else {
                0.0
            }
        }
    }
    pub fn gpu_temp(&mut self) -> f32 {
        let gpu_results: Vec<HashMap<String, Variant>> =
        self.sys.raw_query("SELECT * FROM Sensor where Identifier = '/atigpu/0/temperature/0' or Identifier = '/nvidiagpu/0/temperature/0' AND SensorType = 'Temperature'").unwrap();
        if gpu_results.len() == 0 {
            0.0
        } else {
            let cpu = &gpu_results[0];
            if let Some(Variant::R4(value)) = cpu.get("Value") {
                value.clone()
            } else {
                0.0
            }
        }
    }
    pub fn list_sensors(&mut self) -> Vec<String> {
        let sensor_list_result: Vec<HashMap<String, Variant>> = self
            .sys
            .raw_query("SELECT * FROM Sensor where SensorType='Temperature'")
            .unwrap();

        sensor_list_result
            .iter()
            .filter_map(|s| match s.get("Identifier") {
                Some(Variant::String(value)) => Some(value.clone()),
                _ => None,
            })
            .collect()
    }
}
