import { invoke } from "@tauri-apps/api";

import {
  SerialConnector,
  SerialFilter,
  SerialOptions,
  connectCallback,
  connectionStatus,
} from "./serial";

// import { isMacOS } from "./util";

// @ts-ignore
invoke("get_ports").then(console.log);

export class TauriSerialConnector implements SerialConnector {
  buffer: number[];
  writer?: WritableStreamDefaultWriter<ArrayBuffer>;
  filters: SerialFilter;
  chunkSize: number;
  baudrate: number;
  connectCallback: connectCallback;
  readLoop?: number;
  port = "";

  constructor(options: SerialOptions, connectCallback: connectCallback) {
    this.connectCallback = connectCallback;
    this.baudrate = options?.baudrate ?? 4000000;
    this.chunkSize = options?.chunksize ?? 256;
    this.filters = options?.filters ? options.filters : [];
    this.buffer = [];
    this.port = "";
    // this.connect();
  }

  connect = async (event?: any) => {
    const ports: string[] = await invoke("get_ports");
    if (!ports[0]) return;
    await invoke("open", { path: ports[0], baudRate: 4000000 });
    await this.openPort(ports[0]);
    this.connectCallback(connectionStatus.connect);
  };

  async request(): Promise<void> {
    try {
      let port = await (navigator as any).serial.requestPort({
        filters: this.filters,
      });
      await this.openPort(port);
    } catch (err) {
      const message = "There was an error while connecting to serial device";
      throw new Error(message + " " + err);
    }
  }

  async write(data: number[] | Uint8Array) {
    await invoke("write", { data });
  }

  flush() {
    this.buffer = [];
    return;
  }

  async read(timeout = 1000): Promise<number[]> {
    return await invoke("read");
  }

  async readLine(timeout = 1000): Promise<number[]> {
    let buffer: Array<number> = await invoke("read");
    if (!buffer.length || !buffer.find((byte) => byte === 0xa)) {
      return [];
    }
    const index = buffer.findIndex((byte) => byte === 0xa);
    const line = buffer.slice(0, index - 1);
    buffer = buffer.slice(index + 1);

    return line;
  }

  private async openPort(port: string) {
    if (this.port) return;
    this.port = port;
    this.buffer = [];
  }

  private async sleep(ms: number) {
    return new Promise<void>((res, rej) => {
      setTimeout(() => res(), ms);
    });
  }
}
