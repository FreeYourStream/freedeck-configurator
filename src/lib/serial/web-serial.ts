import { TRANSMIT_BUFFER_SIZE } from "../configFile/consts";
import { isMacOS } from "../misc/util";
import { PortsChangedCallback, SerialConnector, connectionStatus } from ".";
export class WebSerialConnector implements SerialConnector {
  buffer: number[];
  port?: SerialPort;
  writer?: WritableStreamDefaultWriter;
  bufferWrite?: WritableStream;
  abortController?: AbortController;
  reader?: Promise<any>;
  portsChangedCallback: PortsChangedCallback;
  readLoop?: number;
  connectedPortIndex: number = -1;
  ports: SerialPort[] = [];
  constructor(portsChangedCallback: PortsChangedCallback) {
    this.buffer = [];
    this.portsChangedCallback = portsChangedCallback;
    navigator.serial.addEventListener("connect", () => this.devicesChanged());
    navigator.serial.addEventListener("disconnect", () =>
      this.devicesChanged()
    );
    this.devicesChanged();
  }

  devicesChanged = async () => {
    const newPortIndex = await (await this.refreshPorts()).connectedPortIndex;
    if (this.ports.length > 0) {
      this.connect(newPortIndex);
    } else {
      this.closePort();
    }

    this.portsChangedCallback(
      await this.filterPorts(),
      this.connectedPortIndex
    );
  };

  async connect(portIndex: number) {
    if (this.connectedPortIndex !== -1) await this.closePort();
    await this.openPort(this.ports[portIndex]);
    this.connectedPortIndex = portIndex;
    this.portsChangedCallback(
      await this.filterPorts(),
      this.connectedPortIndex
    );
  }

  async disconnect(): Promise<void> {
    this.portsChangedCallback(await this.filterPorts(), -1);
    await this.closePort();
  }

  async refreshPorts() {
    let ports = await navigator.serial.getPorts();
    this.ports = ports;
    if (this.ports.length === 0)
      return { status: connectionStatus.disconnect, connectedPortIndex: -1 };
    else
      return {
        status: connectionStatus.connect,
        connectedPortIndex: 0,
      };
  }

  async requestNewPort(): Promise<void> {
    await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0xf1f0, usbProductId: 0x4005 },
        { usbVendorId: 0x2341, usbProductId: 0x8036 },
        { usbVendorId: 0x2341, usbProductId: 0x8037 },
      ],
    });
    await this.devicesChanged();
  }

  async write(data: number[]) {
    if (!this.writer) throw new Error("no writer exists for this connection");
    if (isMacOS) {
      if (data.length > 62) {
        for (let i = 0; i < data.length; i += 62) {
          await this.write(data.slice(i, i + 62));
        }
        return;
      }

      const arrBuff = Buffer.from([...data]);
      await this.writer.write(arrBuff);
      await this.sleep(1);
    } else {
      const arrBuff = new Buffer([...data]);
      await this.writer.write(arrBuff);
      return;
    }
  }

  flush() {
    this.buffer = [];
    return;
  }

  async read(timeout = 1000): Promise<number[]> {
    const startTime = new Date().getTime();
    while (!this.buffer.length && new Date().getTime() - startTime < 10000) {
      await this.sleep(10);
    }
    if (!this.buffer.length) return [];
    const data = [...this.buffer.splice(0, Math.min(this.buffer.length, 2560))];

    return data;
  }

  async readSerialCommand(): Promise<{ command: number; args: number[] }> {
    throw new Error("not implemented");
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

  private async filterPorts() {
    let ports: string[] = [];
    let i = 0;
    for (const port of this.ports) {
      const info = await port.getInfo();
      if (info.usbVendorId === 0x2341 && info.usbProductId === 0x8037) {
        ports.push("FreeDeck-Micro-" + i);
      } else if (info.usbVendorId === 0xf1f0 && info.usbProductId === 0x4005) {
        ports.push("FreeDeck-Pico-" + i);
      }
      i++;
    }
    return ports;
  }

  private async openPort(port: SerialPort) {
    try {
      await port.open({ baudRate: 4000000, bufferSize: TRANSMIT_BUFFER_SIZE });
    } catch (e) {
      return;
    }
    if (!port.writable) throw new Error("port is not writable");
    this.port = port;
    this.writer = port.writable.getWriter();
    this.buffer = [];

    const self = this;

    this.abortController = new AbortController();
    this.bufferWrite = new WritableStream({
      write(chunk) {
        // console.log(String.fromCharCode.apply(null, chunk));
        self.buffer = [...self.buffer, ...chunk];
      },
    });
    if (!port.readable) throw new Error("port is not readable");
    this.reader = port.readable.pipeTo(this.bufferWrite, {
      signal: this.abortController.signal,
    });
  }

  private async closePort() {
    // thx w3c for this
    this.connectedPortIndex = -1;
    await this.writer?.releaseLock();
    this.abortController?.abort();
    await this.writer?.abort().catch(() => {});
    await this.writer?.close().catch(() => {});
    await this.writer?.releaseLock();
    await this.bufferWrite?.abort().catch(() => {});
    await this.bufferWrite?.close().catch(() => {});
    await this.port?.readable?.cancel().catch(() => {});
    await this.bufferWrite?.abort().catch(() => {});
    await this.bufferWrite?.close().catch(() => {});
    await this.reader?.catch(() => {});
    this.port?.close().catch(() => {});
    this.buffer = [];
    this.port = undefined;
    this.reader = undefined;
  }

  private async sleep(ms: number) {
    return new Promise<void>((res, rej) => {
      setTimeout(() => res(), ms);
    });
  }
}
