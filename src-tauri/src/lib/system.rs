use sysinfo::{Component, ComponentExt, System, SystemExt};

pub struct SystemInfo {
    sys: System,
}

impl SystemInfo {
    pub fn new() -> SystemInfo {
        let sys = System::new_all();
        SystemInfo { sys }
    }
    pub fn cpu_temp(&mut self) -> f32 {
        self.sys
            .components_mut()
            .iter()
            .for_each(|c| println!("{:?}", c.label()));
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
}
