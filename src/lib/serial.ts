export class SerialConnector {
  reader?: ReadableStreamDefaultReader<Uint8Array>;
  writer?: WritableStreamDefaultWriter;
  encoder = new TextEncoder();
  decoder = new TextDecoder();

  async init(onDisconnect?: () => any) {
    if ("serial" in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        try {
          if (onDisconnect)
            (navigator as any).serial.addEventListener(
              "disconnect",
              onDisconnect
            );
        } catch (e) {
          console.log(e);
        }
        await port.open({ baudrate: 4000000 });
        this.reader = port.readable.getReader();
        this.writer = port.writable.getWriter();
      } catch (err) {
        throw new Error("There was an error opening the serial port:" + err);
      }
    } else {
      console.error(
        "Web serial doesn't seem to be enabled in your browser. Try enabling it by visiting:"
      );
      console.error(
        "chrome://flags/#enable-experimental-web-platform-features"
      );
      console.error("opera://flags/#enable-experimental-web-platform-features");
      console.error("edge://flags/#enable-experimental-web-platform-features");
      throw new Error();
    }
  }

  async write(data: number[]) {
    if (!this.writer) return;
    // const dataArrayBuffer = this.encoder.encode(data);
    // console.log(dataArrayBuffer);
    const arrBuff = new Buffer(data);
    return await this.writer.write(arrBuff.buffer);
  }

  async read() {
    if (!this.reader) throw new Error();
    try {
      return await this.reader.read();
      // const readerData = await this.reader.read();
      // return this.decoder.decode(readerData.value);
    } catch (err) {
      const errorMessage = `error reading data: ${err}`;
      console.error(errorMessage);
      throw new Error(err);
    }
  }
}
