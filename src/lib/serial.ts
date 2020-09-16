export class SerialConnector {
  reader?: ReadableStreamDefaultReader<Uint8Array>;
  writer?: WritableStreamDefaultWriter<ArrayBuffer>;
  baudrate: number;

  constructor(baudrate?: number) {
    this.baudrate = baudrate ?? 1000000;
  }

  async connect(onDisconnect?: () => any) {
    if (!(navigator as any).serial) {
      const message =
        "Your browser is not supported. Use chrome or chromium for now";
      alert(message);
      throw new Error(message);
    }
    try {
      const port = await (navigator as any).serial.requestPort();
      if (onDisconnect)
        (navigator as any).serial.addEventListener("disconnect", onDisconnect);
      await port.open({ baudrate: this.baudrate });
      this.reader = port.readable.getReader();
      this.writer = port.writable.getWriter();
    } catch (err) {
      const message = "There was an error while connecting to serial device";
      alert(message);
      throw new Error(message + " " + err);
    }
  }

  write(data: number[]) {
    if (!this.writer) throw new Error("no writer exists for this connection");
    const arrBuff = new Buffer(data);
    return this.writer.write(arrBuff.buffer);
  }

  read() {
    if (!this.reader) throw new Error("no reader exists for this connection");
    try {
      return this.reader.read();
    } catch (err) {
      const message = "There was an error while reading from serial device";
      alert(message);
      throw new Error(message + " " + err);
    }
  }
}
