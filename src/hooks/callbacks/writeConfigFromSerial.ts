import { useCallback } from "react";

import { SerialConnector } from "../../lib/serial";

export const useWriteConfigOverSerialCallback = (
  ready: boolean,
  serial: SerialConnector | undefined,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>,
  setDuration: React.Dispatch<React.SetStateAction<number | null>>,
  getConfigBuffer: () => Buffer
) =>
  useCallback(async () => {
    try {
      if (!ready || !serial) {
        return;
      }
      await serial.write([2]);
      const configBuffer = getConfigBuffer();
      const encoder = new TextEncoder();
      const fileSize = configBuffer.length.toString();
      const fileSizeArray = [...encoder.encode(fileSize)];
      while (fileSizeArray.length < 9) {
        fileSizeArray.unshift(encoder.encode("0")[0]);
      }
      setProgress(0.21);
      const before = new Date().getTime();
      await serial.write(fileSizeArray);
      await serial.write(configBuffer);
      setDuration(new Date().getTime() - before);
      setProgress(1);
    } catch {}
  }, [serial, ready, getConfigBuffer]);
