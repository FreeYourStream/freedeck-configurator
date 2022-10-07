use anyhow::Result;
use sysinfo::{Component, ComponentExt, System, SystemExt};
pub struct SystemInfo {
    sys: System,
}

impl SystemInfo {
    pub fn new() -> Result<SystemInfo> {
        let sys = System::new_all();
        Ok(SystemInfo { sys })
    }
    pub fn cpu_temp(&mut self) -> f32 {
        let cpu: Option<&mut Component> = self.sys.components_mut().iter_mut().find(|c| {
            ["Tdie", "Tctl", "Package id 0", "Computer", "PECI CPU"].contains(&c.label())
        });
        match cpu {
            Some(c) => {
                c.refresh();
                c.temperature()
            }
            None => 0.0,
        }
    }
    pub fn gpu_temp(&mut self) -> f32 {
        let gpu: Option<&mut Component> = self
            .sys
            .components_mut()
            .iter_mut()
            .find(|c| ["edge", "GPU"].contains(&c.label()));
        match gpu {
            Some(g) => {
                g.refresh();
                g.temperature()
            }
            None => 0.0,
        }
    }
    pub fn list_sensors(&mut self) -> Vec<String> {
        self.sys.refresh_components_list();
        self.sys.refresh_components();
        let sensors = self
            .sys
            .components()
            .iter()
            .map(|c| c.label().to_string())
            .collect();
        println!("{:?}", sensors);
        sensors
    }
}
