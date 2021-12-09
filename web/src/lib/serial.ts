export type SerialFilter = { usbVendorId: number }[];
export enum connectionStatus {
  disconnect,
  connect,
}
export interface SerialOptions {
  baudrate?: number;
  filters?: SerialFilter;
}
type connectCallback = (status: connectionStatus) => void;
export class SerialConnector {
  buffer: number[];
  writer?: WritableStreamDefaultWriter<ArrayBuffer>;
  filters: SerialFilter;
  baudrate: number;
  connectCallback: connectCallback;
  readLoop?: number;
  open = false;

  constructor(options: SerialOptions, connectCallback: connectCallback) {
    this.connectCallback = connectCallback;
    this.baudrate = options?.baudrate ?? 4000000;
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

  async request() {
    if (!(navigator as any).serial) {
      const message =
        "Your browser is not supported. Use chrome or chromium for now";
      throw new Error(message);
    }
    try {
      let port = await (navigator as any).serial.requestPort({
        filters: this.filters,
      });
      // if (onConnectionChange) {
      //   (navigator as any).serial.addEventListener("disconnect", async () => {
      //     onConnectionChange(connectionStatus.disconnect);
      //   });
      //   (navigator as any).serial.addEventListener("connect", async () => {
      //     let ports = await (navigator as any).serial.getPorts();
      //     port = ports.find((p: any) => !!p);
      //     port.open({ baudRate: this.baudrate });
      //     onConnectionChange(connectionStatus.connect);
      //     // port
      //     //   .open({ baudRate: this.baudrate })
      //     //   .then(() => onConnectionChange(connectionStatus.connect));
      //     // port.open({ baudRate: this.baudrate }).then(console.log);
      //   });
      // }
      await this.openPort(port);
    } catch (err) {
      const message = "There was an error while connecting to serial device";
      throw new Error(message + " " + err);
    }
  }

  write(data: number[] | Uint8Array) {
    if (!this.writer) throw new Error("no writer exists for this connection");
    const arrBuff = new Buffer([...data]);
    return this.writer.write(arrBuff.buffer);
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

  async readByte(timeout = 1000): Promise<number> {
    const startTime = new Date().getTime();
    while (!this.buffer.length && new Date().getTime() - startTime < timeout) {
      await this.sleep(10);
    }
    if (!this.buffer.length) return -1;
    const byte = this.buffer.splice(0, 1)[0];
    this.buffer.shift();
    return byte;
  }

  private async openPort(port: any) {
    if (this.open) return;
    this.open = true;
    await port.open({ baudRate: this.baudrate });
    const reader: ReadableStreamDefaultReader<Uint8Array> =
      port.readable.getReader();
    this.writer = port.writable.getWriter();
    this.buffer = [];
    if (this.readLoop) clearInterval(this.readLoop);
    this.readLoop = setInterval(async () => {
      try {
        const chunkBuffer = await reader.read();
        if (chunkBuffer.value) {
          this.buffer = [...this.buffer, ...chunkBuffer.value];
        }
      } catch {}
    });
  }

  private async sleep(ms: number) {
    return new Promise((res, rej) => {
      setTimeout(() => res(true), ms);
    });
  }
}
