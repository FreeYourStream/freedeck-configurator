export type SerialFilter = { usbVendorId: number }[];
export enum connectionStatus {
  disconnect,
  connect,
}
export type connectCallback = (status: connectionStatus) => void;
export type PortsChangedCallback = (
  ports: string[],
  connectedPortIndex: number
) => void;
export interface SerialConnector {
  setCommandCallback: (commandCallback: () => void) => void;
  requestNewPort: () => Promise<void>;
  connect: (portIndex: number, showError?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
  write: (data: number[]) => Promise<void>;
  flush: () => Promise<number[]>;
  read: (timeout?: number) => Promise<number[]>;
  readLine: (timeout?: number) => Promise<number[]>;
  readSerialCommand: () => // data: number[]
  Promise<{ command: number; args: number[] }>;
}
