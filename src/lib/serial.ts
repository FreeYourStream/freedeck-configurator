export type SerialFilter = { usbVendorId: number }[];

export class SerialConnector {
  buffer: Uint8Array[];
  writer?: WritableStreamDefaultWriter<ArrayBuffer>;
  filters: SerialFilter;
  baudrate: number;

  constructor(options?: { baudrate?: number; filters?: SerialFilter }) {
    this.baudrate = options?.baudrate ?? 1000000;
    this.filters = options?.filters ? options.filters : [];
    this.buffer = [];
  }

  async connect(
    onDisconnect?: (serial: SerialConnector) => Promise<void> | void
  ) {
    if (!(navigator as any).serial) {
      const message =
        "Your browser is not supported. Use chrome or chromium for now";
      throw new Error(message);
    }
    try {
      const port = await (navigator as any).serial.requestPort({
        filters: this.filters,
      });
      if (onDisconnect) {
        (navigator as any).serial.addEventListener("disconnect", () =>
          onDisconnect(this)
        );
      }
      await port.open({ baudrate: this.baudrate });
      const reader: ReadableStreamDefaultReader<Uint8Array> = port.readable.getReader();
      this.writer = port.writable.getWriter();
      this.buffer = [];

      setTimeout(async () => {
        let chunkBuffer;
        do {
          chunkBuffer = await reader.read();
          if (chunkBuffer.value) this.buffer.push(chunkBuffer.value);
        } while (true);
      });
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
  async read(): Promise<Uint8Array[]> {
    while (!this.buffer.length) {
      await this.sleep(10);
    }
    return this.buffer.splice(0, this.buffer.length);
  }
  async readOne(): Promise<Uint8Array> {
    while (!this.buffer.length) {
      await this.sleep(10);
    }
    return this.buffer.splice(0, 1)[0];
  }
  private async sleep(ms: number) {
    return new Promise((res, rej) => {
      setTimeout(() => res(), ms);
    });
  }
}
