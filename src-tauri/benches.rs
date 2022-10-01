extern crate criterion;
use criterion::{criterion_group, criterion_main, Criterion};

use fd_lib::system::SystemInfo;

use fd_lib::os::get_current_window;
use fd_lib::serial::FDSerial;
fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("refresh serial ports", |b| {
        let mut serial = FDSerial::new();
        b.iter(|| serial.refresh_ports(0, |_ports| ()));
    });
    c.bench_function("get current window", |b| {
        b.iter(|| get_current_window(|path| Some(path.into())))
    });
    c.bench_function("get cpu temp", |b| {
        let mut system = SystemInfo::new().unwrap();
        b.iter(|| system.cpu_temp())
    });
    c.bench_function("get gpu temp", |b| {
        let mut system = SystemInfo::new().unwrap();
        b.iter(|| system.gpu_temp())
    });
}

criterion_group!(all, criterion_benchmark);
criterion_main!(all);
