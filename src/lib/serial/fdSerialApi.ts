import { minFWVersion } from "../../../package.json";
import { TRANSMIT_BUFFER_SIZE } from "../configFile/consts";
import { optimizeForSSD1306 } from "../configFile/ssd1306";
import { _composeText } from "../image/composeImage";
import { compareVersions, sleep } from "../misc/util";
import { TauriSerialConnector } from "./tauri-serial";
import { WebSerialConnector } from "./web-serial";
import { PortsChangedCallback, SerialConnector, connectionStatus } from ".";
const commands = {
  init: 0x3,
  getFirmwareVersion: 0x10,
  readConfig: 0x20,
  writeConfig: 0x21,
  getHasJson: 0x22,
  getCurrentPage: 0x30,
  setCurrentPage: 0x31,
  getPageCount: 0x32,
  oledClear: 0x40,
  oledPower: 0x41,
  oledWriteLine: 0x42,
  oledWriteData: 0x43,
  oledSetParameters: 0x44,
};

export class FDSerialAPI {
  Serial: SerialConnector;
  connected: connectionStatus = connectionStatus.disconnect;
  portsChangedCallbacks: { [x: number]: PortsChangedCallback } = {};
  ports: string[] = [];
  connectedPortIndex: number = -1;
  calls: Array<{ id: number; name?: string }> = [];

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
    await this.waitForTurn("getFirmwareVersion");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.getFirmwareVersion]);
    const fwVersion = await this.readAsciiLine();
    // take care about legacy FWs
    let result: string;
    if (fwVersion === "")
      return this.throwError("could not get firmware version");
    else result = fwVersion;
    this.nextCall();
    return result;
  }

  async getHasJson() {
    await this.waitForTurn("getHasJson");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.getHasJson]);
    const hasJson = await this.readAsciiLine();
    this.nextCall();
    return hasJson === "1";
  }

  async getCurrentPage(): Promise<number> {
    await this.waitForTurn("getCurrentPage");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.getCurrentPage]);
    const currentPage = await this.readAsciiLine();
    const result = parseInt(currentPage);
    this.nextCall();
    return result;
  }

  async setCurrentPage(goTo: number) {
    await this.waitForTurn("setCurrentPage");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    await this.write([commands.init, commands.setCurrentPage, goTo.toString()]);
    this.nextCall();
  }

  async sendImageToScreen(image: Buffer, screen = 0) {
    await this.waitForTurn("imageToScreen");
    const headerSize = image.readUInt32LE(10); // 130
    const optimizedImage = optimizeForSSD1306(image.slice(headerSize));
    await this.write([commands.init, commands.oledWriteData, screen]);
    await this.Serial.write([...optimizedImage]);
    await this.nextCall();
  }

  async writeToScreen(text: string, screen = 0, size = 1) {
    await this.waitForTurn("writeToScreen");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    // await this.write([commands.init, commands.oledClear, screen]);
    const image = await _composeText({
      font: "fonts/medium.fnt",
      text,
      position: "bottom",
    });
    this.nextCall();
    await this.sendImageToScreen(image, screen);
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
      startedAt: Date
    ) => void
  ) {
    const fwVersion = await this.getFirmwareVersion();
    await this.waitForTurn("readConfigFromSerial");

    if (fwVersion.split(".")[0] === "1") {
      this.throwError("unsupported 1.x firmware");
    } else {
      await this.write([0x3, commands.readConfig]);
    }
    const fileSizeStr = await this.readAsciiLine();
    if (fileSizeStr === "unavailable") this.throwError("no config available");
    if (!fileSizeStr.length) {
      this.throwError("could not receive filesize");
    }
    const fileSize = parseInt(fileSizeStr);
    const data: number[] = [];
    const transferStartedTime = new Date();
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
    const result = Buffer.from(data.slice(0, fileSize));
    this.nextCall();
    return result;
  }

  async writeConfigOverSerial(
    config: Buffer,
    progressCallback?: (
      received: number,
      fileSize: number,
      startedAt: Date
    ) => void
  ) {
    const fwVersion = await this.getFirmwareVersion();
    await this.waitForTurn("writeConfigOverSerial");
    if (compareVersions(fwVersion, minFWVersion) === -1)
      this.throwError(
        `${fwVersion}: Unsupported firmware. Please update to version ${minFWVersion} or newer. Check the help page for more information.`
      );
    const fileSize = config.length.toString();

    await this.write([0x3, commands.writeConfig]);
    await this.write([fileSize]);
    const transferStartedTime = new Date();
    let sent = 0;
    const sendAt = Math.pow(2, 13);
    while (sent < config.length) {
      const end = Math.min(config.length, sent + TRANSMIT_BUFFER_SIZE);
      const chunk = config.slice(sent, end);
      const numberChunk = [...chunk];
      sent += numberChunk.length;
      await this.Serial.write([...numberChunk]);
      if (sent % sendAt === 0)
        progressCallback?.(sent, config.length, transferStartedTime);
    }
    setTimeout(
      () => progressCallback?.(sent, config.length, transferStartedTime),
      0
    );

    this.nextCall();
  }

  async testOledParameters(
    oledSpeed: number,
    oledDelay: number,
    preChargePeriod: number,
    clockFreq: number,
    clockDivider: number
  ) {
    await this.waitForTurn("testOledParameters");
    if (this.connected === connectionStatus.disconnect)
      this.throwError("not connected");
    this.Serial.flush();
    const refreshFrequency =
      Math.min(15, clockFreq) * 16 + Math.min(15, clockDivider);
    await this.write([
      commands.init,
      commands.oledSetParameters,
      oledSpeed.toString(),
      oledDelay.toString(),
      preChargePeriod.toString(),
      refreshFrequency.toString(),
    ]);
    this.nextCall();
  }

  async readSerialCommand() {
    await this.waitForTurn("readSerialCommand");
    let result = this.Serial.readSerialCommand();
    this.nextCall();
    return result;
  }

  private async readAsciiLine() {
    const result = await this.Serial.readLine(3000);

    return String.fromCharCode(...result)
      .replace("\r", "")
      .replace("\n", "");
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

  private waitForTurn = async (name?: string) => {
    let callId: number;
    if (this.calls.length) {
      callId = this.calls[this.calls.length - 1].id + 1;
    } else {
      callId = 0;
    }
    this.calls.push({ id: callId, name });
    while (this.calls[0].id !== callId) {
      await sleep(100);
    }
  };
  private nextCall = () => {
    this.calls.shift();
  };
  private throwError = (message: string) => {
    this.nextCall();
    throw new Error(message);
  };
}
