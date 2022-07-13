import {
  SerialConnector,
  SerialFilter,
  SerialOptions,
  connectCallback,
  connectionStatus,
} from "./serial";
import { isMacOS } from "./util";

export class WebSerialConnector implements SerialConnector {
  buffer: number[];
  writer?: WritableStreamDefaultWriter<ArrayBuffer>;
  filters: SerialFilter;
  chunkSize: number;
  baudrate: number;
  connectCallback: connectCallback;
  readLoop?: number;
  open = false;

  constructor(options: SerialOptions, connectCallback: connectCallback) {
    this.connectCallback = connectCallback;
    this.baudrate = options?.baudrate ?? 4000000;
    this.chunkSize = options?.chunksize ?? 256;
    this.filters = options?.filters ? options.filters : [];
    this.buffer = [];
    this.connect();
    (navigator as any).serial.addEventListener("connect", this.connect);
    (navigator as any).serial.addEventListener("disconnect", async (e: any) => {
      clearInterval(this.readLoop);
      this.readLoop = undefined;
      this.open = false;
      this.connectCallback(connectionStatus.disconnect);
    });
  }

  connect = async (event?: any) => {
    let ports = await (navigator as any).serial.getPorts();
    const port = ports.find((p: any) => !!p);
    // console.log(event);
    // const port =
    //   event?.port ??
    //   event?.target ??
    //   (await (navigator as any).serial.getPorts())?.find((p: any) => !!p);
    if (!port) return;
    await this.openPort(port);
    this.connectCallback(connectionStatus.connect);
  };

  async request(): Promise<void> {
    if (!(navigator as any).serial) {
      const message =
        "Your browser is not supported. Use chrome or chromium for now";
      throw new Error(message);
    }
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

  async write(data: number[]) {
    if (!this.writer) throw new Error("no writer exists for this connection");
    if (isMacOS) {
      if (data.length > this.chunkSize) {
        for (let i = 0; i < data.length; i += this.chunkSize) {
          await this.write(data.slice(i, i + this.chunkSize));
        }
        return;
      }

      const arrBuff = Buffer.from([...data]);
      await this.writer.write(arrBuff.buffer);
      await this.sleep(1);
    } else {
      const arrBuff = new Buffer([...data]);
      return this.writer.write(arrBuff.buffer);
    }
  }

  flush() {
    this.buffer = [];
    return;
  }

  async read(timeout = 1000): Promise<number[]> {
    const startTime = new Date().getTime();
    while (!this.buffer.length && new Date().getTime() - startTime < timeout) {
      await this.sleep(10);
    }
    if (!this.buffer.length) return [];
    const data = [...this.buffer];
    // this.buffer = this.buffer.slice(0, data.length);
    this.flush();
    return data;
  }

  async readLine(timeout = 1000): Promise<number[]> {
    const startTime = new Date().getTime();
    while (
      !this.buffer.find((byte) => byte === 0xa) &&
      new Date().getTime() - startTime < timeout
    ) {
      await this.sleep(10);
    }

    if (!this.buffer.length || !this.buffer.find((byte) => byte === 0xa)) {
      return [];
    }
    const index = this.buffer.findIndex((byte) => byte === 0xa);
    const line = this.buffer.slice(0, index - 1);
    this.buffer = this.buffer.slice(index + 1);

    return line;
  }

  private async openPort(port: any) {
    if (this.open) return;
    this.open = true;
    await port.open({ baudRate: this.baudrate });
    this.writer = port.writable.getWriter();
    this.buffer = [];

    const self = this;
    const bufferWrite = new WritableStream({
      write(chunk) {
        // console.log(String.fromCharCode.apply(null, chunk));
        self.buffer = [...self.buffer, ...chunk];
      },
    });
    port.readable.pipeTo(bufferWrite);
  }

  private async sleep(ms: number) {
    return new Promise<void>((res, rej) => {
      setTimeout(() => res(), ms);
    });
  }
}