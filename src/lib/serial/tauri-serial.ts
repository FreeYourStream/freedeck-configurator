import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

import { PortsChangedCallback, SerialConnector } from ".";

export class TauriSerialConnector implements SerialConnector {
  portsChangedCallback: PortsChangedCallback;
  port = "";
  ports: string[] = [];

  constructor(portsChangedCallback: PortsChangedCallback) {
    this.portsChangedCallback = portsChangedCallback;
    this.port = "";
    this.refreshPorts(true).then(() =>
      listen<string[]>("ports_changed", ({ payload }) => {
        this.refreshPorts(true, payload);
      })
    );
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
  async refreshPorts(autoConnect: boolean, prePorts?: string[]) {
    const ports: string[] = prePorts?.length
      ? prePorts
      : await invoke("get_ports");
    this.ports = ports;
    if (this.ports.length === 0) return this.portsChangedCallback(ports, -1);
    const portIndex = this.ports.findIndex((port) => port === this.port);
    if (portIndex === -1 && autoConnect) {
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

  async flush() {
    await invoke("flush");
  }

  async read(timeout = 1000): Promise<number[]> {
    let data: number[] = [];
    do {
      data = await invoke<number[]>("read");
    } while (data.length === 0);
    return data;
  }

  async readLine(timeout = 1000): Promise<number[]> {
    let data: number[] = [];
    do {
      data = await invoke<number[]>("read_line").catch(() => []);
    } while (data.length === 0);
    return data;
  }

  async readSerialCommand() {
    let start = (await this.readLine()).filter((x) => x !== 13 && x !== 10);
    if (start[0] !== 3) {
      console.log(start, await this.readLine());
      throw new Error("wrong start byte");
    }
    let command = (await this.readLine()).filter(
      (x) => x !== 13 && x !== 10
    )[0];
    if (command < 16) throw new Error("invalid command");
    const data = (await this.readLine()).filter((x) => x !== 13 && x !== 10);
    const args = String.fromCharCode(...data)
      .split("\t")
      .map((x) => parseInt(x));
    return { command, args };
  }
}
