import {
  PortsChangedCallback,
  SerialConnector,
  connectionStatus,
} from "./serial";
import { TauriSerialConnector } from "./tauri-serial";
import { WebSerialConnector } from "./web-serial";
const commands = {
  init: 0x3,
  getFirmwareVersion: 0x10,
  readConfig: 0x20,
  writeConfig: 0x21,
  getCurrentPage: 0x30,
  setCurrentPage: 0x31,
  getPageCount: 0x32,
  oledClear: 0x40,
  oledPower: 0x41,
  oledWriteLine: 0x42,
  oledWriteData: 0x43,
};

export class FDSerialAPI {
  Serial: SerialConnector;
  connected: connectionStatus = connectionStatus.disconnect;
  portsChangedCallbacks: { [x: number]: PortsChangedCallback } = {};
  blockCommunication: boolean = false;
  ports: string[] = [];
  connectedPortIndex: number = -1;

  constructor() {
    if ((window as any).__TAURI_IPC__)
      this.Serial = new TauriSerialConnector(this.onPortsChanged);
    else this.Serial = new WebSerialConnector(this.onPortsChanged);
  }

  async connect(portIndex: number) {
    await this.Serial.connect(portIndex, true);
    this.connected = connectionStatus.connect;
  }
  async disconnect() {
    await this.Serial.disconnect();
    this.connected = connectionStatus.disconnect;
  }
  async requestNewPort() {
    await this.Serial.requestNewPort();
  }

  async getFirmwareVersion() {
    if (this.blockCommunication) throw new Error("reading is blocked");
    if (this.connected === connectionStatus.disconnect)
      throw new Error("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.getFirmwareVersion]);
    const fwVersion = await this.readAsciiLine();
    // take care about legacy FWs
    if (fwVersion === "") return "1.1.0";
    else return fwVersion;
  }

  async getCurrentPage(): Promise<number> {
    if (this.blockCommunication) throw new Error("reading is blocked");
    if (this.connected === connectionStatus.disconnect)
      throw new Error("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.getCurrentPage]);
    const currentPage = await this.readAsciiLine();
    return parseInt(currentPage);
  }

  async setCurrentPage(goTo: number) {
    if (this.blockCommunication) throw new Error("writing is blocked");
    if (this.connected === connectionStatus.disconnect)
      throw new Error("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.setCurrentPage, goTo.toString()]);
  }

  async writeToScreen(text: string, screen = 0, size = 1) {
    if (this.blockCommunication) throw new Error("reading is blocked");
    if (this.connected === connectionStatus.disconnect)
      throw new Error("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.oledClear, screen]);
    await this.write([
      commands.init,
      commands.oledWriteLine,
      screen,
      0,
      size,
      text,
    ]);
  }

  registerOnPortsChanged(callback: PortsChangedCallback): number {
    const id = Object.keys(this.portsChangedCallbacks).length;
    this.portsChangedCallbacks[id] = callback;
    this.onPortsChanged(this.ports, this.connectedPortIndex);
    return id;
  }
  clearOnPortsChanged(id: number) {
    delete this.portsChangedCallbacks[id];
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

    this.blockCommunication = true;
    if (fwVersion.split(".")[0] === "1") {
      console.log("OLD FIRMWARE", fwVersion);
      await this.Serial.write([0x1]);
    } else {
      await this.write([0x3, commands.readConfig]);
    }

    const fileSizeStr = await this.readAsciiLine();
    if (!fileSizeStr.length) {
      this.blockCommunication = false;
      throw new Error("could not receive filesize");
    }
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
    this.blockCommunication = false;
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

    this.blockCommunication = true;
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
      await this.Serial.write([...numberArray]);
    } else {
      await this.write([0x3, commands.writeConfig]);
      await this.write([fileSize]);
    }

    const transferStartedTime = new Date().getTime();
    // setTimeout(async () => {
    //   let lastLine = "";
    //   do {
    //     lastLine = await this.readAsciiLine();
    //     console.log("last line", lastLine);
    //     if (isNaN(parseInt(lastLine))) continue;
    //     progressCallback?.(
    //       parseInt(lastLine),
    //       config.length,
    //       transferStartedTime
    //     );
    //   } while (lastLine !== fileSize);
    // });
    let sent = 0;
    while (sent < config.length) {
      const end = Math.min(config.length, sent + 1024);
      const chunk = config.slice(sent, end);
      const numberChunk = [...chunk];
      sent += numberChunk.length;
      await this.Serial.write([...numberChunk]);
      progressCallback?.(sent, config.length, transferStartedTime);
    }

    this.blockCommunication = false;
  }

  private async readAsciiLine() {
    const result = await this.Serial.readLine(3000);
    return String.fromCharCode(...result);
  }
  private async read(): Promise<number[]> {
    return this.Serial.read(1000);
  }

  private async write(data: Array<number | string>) {
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
    // console.log("sending to freedeck", mappedData);
    await this.Serial.write(mappedData);
  }

  private onPortsChanged = async (
    ports: string[],
    connectedPortIndex: number
  ) => {
    this.ports = ports;
    this.connectedPortIndex = connectedPortIndex;
    if (this.connectedPortIndex === -1)
      this.connected = connectionStatus.disconnect;
    else this.connected = connectionStatus.connect;
    Object.values(this.portsChangedCallbacks).forEach((cb) =>
      cb(ports, connectedPortIndex)
    );
  };
}
