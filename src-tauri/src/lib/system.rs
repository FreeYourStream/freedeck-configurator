use sysinfo::{ComponentExt, System, SystemExt};

pub struct SystemInfo {
    sys: System,
}

impl SystemInfo {
    pub fn new() -> SystemInfo {
        let sys = System::new_all();
        SystemInfo { sys }
    }
    pub fn cpu_temp(&mut self) -> f32 {
        let cpu = self
            .sys
            .components_mut()
            .iter_mut()
            .find(|c| ["Tdie", "Tctl", "Package id 0", "Computer"].contains(&c.label()))
            .unwrap();
        cpu.refresh();
        cpu.temperature()
    }
    pub fn gpu_temp(&mut self) -> f32 {
        let gpu = self
            .sys
            .components_mut()
            .iter_mut()
            .find(|c| ["edge"].contains(&c.label()))
            .unwrap();
        gpu.refresh();
        gpu.temperature()
    }
}
