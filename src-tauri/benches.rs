extern crate criterion;
use criterion::{criterion_group, criterion_main, Criterion};

use fd_lib::os::refresh_ports;

use std::sync::{Arc, Mutex};

use fd_lib::os::get_current_window;
use fd_lib::{serial::FDSerial, state::FDState};
fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("refresh serial ports", |b| {
        let state = Arc::new(Mutex::new(FDState {
            current_window: "".into(),
            serial: FDSerial::new(),
        }));
        b.iter(|| refresh_ports(&state, 0, |_ports| ()));
    });
    c.bench_function("get current window", |b| {
        b.iter(|| get_current_window(|path| Some(path.into())))
    });
}

criterion_group!(all, criterion_benchmark);
criterion_main!(all);
