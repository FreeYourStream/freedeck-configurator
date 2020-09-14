import React, { useCallback, useEffect, useState } from "react";

import { FDButton } from "../lib/components/Button";
import { Label, Row, Title, Value } from "../lib/components/Misc";
import { Serial } from "../lib/serial";

export const Options: React.FC<{
  loadConfigFile: (buffer: Buffer) => void;
}> = ({ loadConfigFile }) => {
  const [serial, setSerial] = useState<Serial>();
  const [progress, setProgress] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => setSerial(new Serial()), []);

  const connectSerial = useCallback(async () => {
    await serial?.init();
  }, [serial]);

  const readHeader = useCallback(async () => {
    if (!serial) return;
    await serial.write([1]);

    const first = await serial.read();
    if (!first?.value) return;

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
      if (counter++ > 200) {
        counter = 0;
        setProgress(read.byteLength / fileSize);
      }
    } while (read.length < fileSize);
    const stop = new Date().getTime();
    setProgress(read.byteLength / fileSize);
    setDuration(stop - start);
    loadConfigFile(read.slice(0, fileSize));
  }, [serial]);
  return (
    <>
      <Title>Options</Title>
      <Row>
        <Label>Connect:</Label>
        <FDButton onClick={() => connectSerial()}>Connect</FDButton>
      </Row>
      <Row>
        <Label>Read Config from FreeDeck:</Label>
        <FDButton disabled={!serial} onClick={() => readHeader()}>
          Go!
        </FDButton>
      </Row>
      <Row>
        <Label>Progress:</Label>
        {progress && <Value>{Math.floor(progress * 100)}%</Value>}
      </Row>
      <Row>
        <Label>Duration:</Label>
        {duration && <Value>{duration / 1000}s</Value>}
      </Row>
    </>
  );
};
