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
    await serial.flush();
    await serial.write([0x3, 0xa, 0x20, 0xa]);

    const first = await serial.readLine();
    console.log(first);
    if (!first.length) return null;
    return;
    // const fileSize = parseInt(String.fromCharCode(...first));

    // let read: Buffer = Buffer.from(
    //   first.slice(first.findIndex((value) => value === 13) + 2) // +2 because we need to strip CR and LF
    // );

    // let temp: number;
    // let counter = 0;
    // const start = new Date().getTime();
    // do {
    //   temp = await serial.readByte();
    //   read = Buffer.concat([read, Buffer.from(temp)]);
    //   if (counter++ > 100) {
    //     counter = 0;
    //     setProgress(read.byteLength / fileSize);
    //   }
    // } while (read.length < fileSize);
    // const stop = new Date().getTime();
    // setProgress(read.byteLength / fileSize);
    // setDuration(stop - start);
    // try {
    //   loadConfigFile(read.slice(0, fileSize));
    //   return fileSize;
    // } catch {
    //   console.log("BONK");
    // }
    // return -1;
    // eslint-disable-next-line
  }, [serial]);
