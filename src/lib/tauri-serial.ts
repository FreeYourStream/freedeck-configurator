import { invoke } from "@tauri-apps/api";

import { PortsChangedCallback, SerialConnector } from "./serial";

export class TauriSerialConnector implements SerialConnector {
  buffer: number[];
  portsChangedCallback: PortsChangedCallback;
  port = "";
  ports: string[] = [];

  constructor(portsChangedCallback: PortsChangedCallback) {
    this.portsChangedCallback = portsChangedCallback;
    this.buffer = [];
    this.port = "";
    this.refreshPorts(true);
    setInterval(async () => {
      this.refreshPorts(false);
    }, 1000);
  }
  async connect(portIndex: number, showError = false): Promise<void> {
    try {
      await invoke("open", { path: this.ports[portIndex], baudRate: 4000000 });
      this.port = this.ports[portIndex];
      this.portsChangedCallback(this.ports, portIndex);
    } catch (e: any) {
      if (showError) alert(`${this.ports[portIndex]} - ${e as string}`);
      throw e;
    }
  }
  async disconnect(): Promise<void> {
    await invoke("close", { path: this.port });
    this.port = "";
    this.portsChangedCallback(this.ports, -1);
  }
  async refreshPorts(initial: boolean) {
    const ports: string[] = await invoke("get_ports");
    this.ports = ports;
    if (this.ports.length === 0) return this.portsChangedCallback(ports, -1);
    const portIndex = this.ports.findIndex((port) => port === this.port);
    if (portIndex === -1 && initial) {
      let i = 0;
      do {
        try {
          await this.connect(i);
          return this.portsChangedCallback(ports, i);
        } catch (e) {
          i++;
        }
      } while (i < ports.length);
    }
    this.portsChangedCallback(ports, portIndex);
  }
  async requestNewPort(): Promise<void> {}

  async write(data: number[] | Uint8Array) {
    await invoke("write", { data });
  }

  flush() {
    this.buffer = [];
    return;
  }

  async read(timeout = 1000): Promise<number[]> {
    const data = [ ...this.buffer,...await invoke<number[]>("read")]
    this.buffer = []
    return data
  }

  async readLine(timeout = 1000): Promise<number[]> {
    this.buffer = [...this.buffer, ...await invoke<number[]>("read")];
    if (!this.buffer.length || !this.buffer.find((byte) => byte === 0xa)) {
      return [];
    }
    const index = this.buffer.findIndex((byte) => byte === 0xa);
    const line = [...this.buffer.slice(0, index - 1)]
    this.buffer = [...this.buffer.slice(index + 1)];

    return line;
  }
}
