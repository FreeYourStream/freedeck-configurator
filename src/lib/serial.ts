export type SerialFilter = { usbVendorId: number }[];
export enum connectionStatus {
  disconnect,
  connect,
}
export interface SerialOptions {
  baudrate?: number;
  chunksize?: number;
  filters?: SerialFilter;
}
export type connectCallback = (status: connectionStatus) => void;
export interface SerialConnector {
  request: () => Promise<void>;
  write: (data: number[]) => Promise<void>;
  flush: () => void;
  read: (timeout?: number) => Promise<number[]>;
  readLine: (timeout?: number) => Promise<number[]>;
}
