import { useCallback } from "react";

import { SerialConnector } from "../../lib/serial";

export const useWriteConfigOverSerialCallback = (
  ready: boolean,
  serial: SerialConnector | undefined,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>,
  setDuration: React.Dispatch<React.SetStateAction<number | null>>,
  getConfigBuffer: () => Buffer | null
) =>
  useCallback(async () => {
    try {
      if (!ready || !serial) {
        return;
      }
      const configBuffer = getConfigBuffer();
      if (configBuffer === null) return;
      await serial.write([2]);
      const encoder = new TextEncoder();
      const fileSize = configBuffer.length.toString();
      const fileSizeArray = [...encoder.encode(fileSize)];
      while (fileSizeArray.length < 9) {
        fileSizeArray.unshift(encoder.encode("0")[0]);
      }
      const before = new Date().getTime();
      await serial.write(fileSizeArray);
      const decoder = new TextDecoder();
      let cancelled = false;
      const timeout = setTimeout(() => (cancelled = true), 300);
      for (let i = 0; i < Math.ceil(configBuffer.length / 512); i++) {
        await serial.write(configBuffer.slice(i * 512, (i + 1) * 512));

        const sendSize = Buffer.concat(
          (await serial.read(() => cancelled)).map((arr) => Buffer.from(arr))
        );
        const cutToOneValue = sendSize.slice(
          0,
          sendSize.findIndex((val) => val === 13)
        );
        setProgress(
          parseInt(decoder.decode(cutToOneValue)) / configBuffer.length
        );
      }
      setDuration(new Date().getTime() - before);
      setProgress(1);
    } catch {}
  }, [serial, ready, getConfigBuffer]);
