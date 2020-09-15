import { useCallback } from "react";

import { SerialConnector } from "../../lib/serial";

export const useReadConfigFromSerialCallback = (
  serial: SerialConnector | undefined,
  setProgress: React.Dispatch<React.SetStateAction<number | null>>,
  setDuration: React.Dispatch<React.SetStateAction<number | null>>,
  loadConfigFile: (config: Buffer) => any
) =>
  useCallback(async () => {
    if (!serial?.writer) return null;
    await serial.write([1]);

    const first = await serial.read();
    if (!first?.value) return null;

    const fileSize = parseInt(
      String.fromCharCode(
        ...first.value.slice(
          0,
          first.value.findIndex((value) => value === 13)
        )
      )
    );

    let read: Buffer = new Buffer(
      first.value.slice(first.value.findIndex((value) => value === 13) + 2) // +2 because we need to strip CR and LF
    );
    let temp: ReadableStreamReadResult<any>;
    let counter = 0;
    const start = new Date().getTime();
    do {
      temp = await serial.read();
      read = Buffer.concat([read, Buffer.from(temp.value)]);
      if (counter++ > 100) {
        counter = 0;
        setProgress(read.byteLength / fileSize);
      }
    } while (read.length < fileSize);
    const stop = new Date().getTime();
    setProgress(read.byteLength / fileSize);
    setDuration(stop - start);
    loadConfigFile(read.slice(0, fileSize));
    return fileSize;
  }, [serial]);
