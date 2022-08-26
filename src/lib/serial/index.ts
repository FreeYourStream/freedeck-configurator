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
  requestNewPort: () => Promise<void>;
  connect: (portIndex: number, showError?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
  write: (data: number[]) => Promise<void>;
  flush: () => void;
  read: (timeout?: number) => Promise<number[]>;
  readLine: (timeout?: number) => Promise<number[]>;
  readSerialCommand: () => Promise<{ command: number; args: number[] }>;
}
