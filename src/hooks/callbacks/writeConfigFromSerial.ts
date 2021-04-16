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
      await serial.write([0x3, 0xa, 0x21, 0xa]);
      const encoder = new TextEncoder();
      const fileSize = configBuffer.length.toString();
      const fileSizeArray = [...encoder.encode(fileSize)];
      while (fileSizeArray.length < 9) {
        fileSizeArray.unshift(encoder.encode("0")[0]);
      }
      await serial.write(fileSizeArray);
      await serial.flush();
      const before = new Date().getTime();
      const decoder = new TextDecoder();
      let cancelled = false;
      for (let i = 0; i < Math.ceil(configBuffer.length / 512); i++) {
        await serial.write(configBuffer.slice(i * 512, (i + 1) * 512));
        if (!cancelled) {
          // eslint-disable-next-line
          const timeout = setTimeout(() => (cancelled = true), 300);
          // const sendSize = Buffer.concat(
          //   // eslint-disable-next-line
          //   (await serial.read()).map((arr) => Buffer.from(arr))
          // );
          // if (sendSize.length) {
          //   clearTimeout(timeout);
          //   const cutToOneValue = sendSize.slice(
          //     0,
          //     sendSize.findIndex((val) => val === 13)
          //   );
          //   setProgress(
          //     parseInt(decoder.decode(cutToOneValue)) / configBuffer.length
          //   );
          // }
        }
      }
      setDuration(new Date().getTime() - before);
      setProgress(1);
    } catch {}
    // eslint-disable-next-line
  }, [serial, ready, getConfigBuffer]);
