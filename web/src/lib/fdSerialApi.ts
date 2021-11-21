import { SerialConnector, SerialOptions, connectionStatus } from "./serial";

type connectCallback = (event: connectionStatus) => void;
export class FDSerialAPI {
  Serial: SerialConnector;
  connected: connectionStatus = connectionStatus.disconnect;
  connectCallbacks: { [x: number]: connectCallback } = {};
  constructor(options: SerialOptions = {}) {
    this.Serial = new SerialConnector(
      {
        filters: [
          {
            usbVendorId: 0xf1f0,
          },
        ],
        ...options,
      },
      this.onConnectionChange
    );
  }

  async connect() {
    if (!this.connected)
      return this.Serial.request().then(() => {
        this.connected = connectionStatus.connect;
        Object.values(this.connectCallbacks).forEach((cb) =>
          cb(connectionStatus.connect)
        );
      });
  }

  async getFirmwareVersion() {
    if (this.connected === connectionStatus.disconnect)
      throw new Error("not connected");
    this.Serial.flush();
    this.write([0x3, 0x10]);
    const fwVersion = await this.readAsciiLine();
    // take care about legacy FWs
    if (fwVersion === "") return "1.1.0";
    else return fwVersion;
  }

  registerOnConStatusChange(callback: connectCallback): number {
    const id = Object.keys(this.connectCallbacks).length;
    this.connectCallbacks[id] = callback;
    this.onConnectionChange(this.connected);
    return id;
  }

  clearOnConStatusChange(id: number) {
    delete this.connectCallbacks[id];
  }
  async readConfigFromSerial(
    progressCallback?: (
      received: number,
      fileSize: number,
      speed: number
    ) => void
  ) {
    const fwVersion = await this.getFirmwareVersion();
    console.log(fwVersion);
    if (fwVersion.split(".")[0] === "1") {
      console.log("OLD FIRMWARE", fwVersion);
      await this.Serial.write([0x1]);
    } else {
      console.log("start");
      await this.write([0x3, 0x20]);
      console.log("DONE");
    }

    const fileSizeStr = await this.readAsciiLine();
    console.log(fileSizeStr);
    if (!fileSizeStr.length) throw new Error("could not receive filesize");
    const fileSize = parseInt(fileSizeStr);
    const data: number[] = [];
    const transferStartedTime = new Date().getTime();
    progressCallback?.(data.length, fileSize, transferStartedTime);
    let i = 0;
    while (data.length < fileSize) {
      const received = await this.read();
      if (!(i++ % 8)) {
        progressCallback?.(data.length, fileSize, transferStartedTime);
      }
      if (received.length === 0) break;
      data.push(...received);
    }
    progressCallback?.(data.length, fileSize, transferStartedTime);
    return Buffer.from(data.slice(0, fileSize));
  }

  async writeConfigOverSerial(
    config: Buffer,
    progressCallback?: (
      received: number,
      fileSize: number,
      speed: number
    ) => void
  ) {
    const fwVersion = await this.getFirmwareVersion();
    const fileSize = config.length.toString();
    if (fwVersion.split(".")[0] === "1") {
      console.log(
        "OLD FIRMWARE, will be removed in the future, please upgrade"
      );
      await this.Serial.write([0x2]);
      let oldFileSize = fileSize;
      while (oldFileSize.length < 9) {
        oldFileSize = "0" + oldFileSize;
      }
      const numberArray = new TextEncoder().encode(oldFileSize);
      await this.Serial.write(numberArray);
    } else {
      await this.write([0x3, 0x21]);
      await this.write([fileSize]);
    }

    const transferStartedTime = new Date().getTime();
    setTimeout(async () => {
      let lastLine = "";
      do {
        lastLine = await this.readAsciiLine();
        if (isNaN(parseInt(lastLine))) continue;
        progressCallback?.(
          parseInt(lastLine),
          config.length,
          transferStartedTime
        );
      } while (lastLine !== fileSize);
    });
    await this.Serial.write(config);
  }

  private async readAsciiLine() {
    const result = await this.Serial.readLine(3000);
    return String.fromCharCode(...result);
  }

  private async readLine() {
    const result = await this.Serial.readLine(300);
    return result;
  }

  private async readByte(): Promise<number> {
    return this.Serial.readByte(1000);
  }

  private async read(): Promise<number[]> {
    return this.Serial.read(1000);
  }

  private write(data: Array<number | string>) {
    let mappedData: number[] = [];
    data.forEach((date) => {
      if (typeof date === "string") {
        const encoder = new TextEncoder();
        const ascii = [...encoder.encode(date)];
        mappedData.push(...ascii);
      } else {
        mappedData.push(date);
      }
      mappedData.push(0xa);
    });
    this.Serial.write(mappedData);
  }

  private onConnectionChange = async (status: connectionStatus) => {
    this.connected = status;
    Object.values(this.connectCallbacks).forEach((cb) => cb(status));
  };
}
