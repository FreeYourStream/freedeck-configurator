import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { useReadConfigFromSerialCallback } from "../hooks/callbacks/readConfigFromSerial";
import { useWriteConfigOverSerialCallback } from "../hooks/callbacks/writeConfigFromSerial";
import { FDButton } from "../lib/components/Button";
import { Divider, Label, Row, Title, Value } from "../lib/components/Misc";
import { SerialConnector } from "../lib/serial";

const Wrapper = styled.div`
  min-width: 470px;
`;
export const Serial: React.FC<{
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Buffer;
}> = ({ loadConfigFile, getConfigBuffer }) => {
  const [serial, setSerial] = useState<SerialConnector>();
  const [ready, setReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  useEffect(() => setSerial(new SerialConnector()), []);

  const connectSerial = useCallback(async () => {
    try {
      await serial?.connect(async function (serial) {
        serial.flush().then(() => undefined);
        setReady(false);
      });
      setReady(true);
    } catch {}
  }, [serial]);

  const writeConfigOverSerial = useWriteConfigOverSerialCallback(
    ready,
    serial,
    setProgress,
    setDuration,
    getConfigBuffer
  );

  const readConfigFromSerial = useReadConfigFromSerialCallback(
    serial,
    setProgress,
    setDuration,
    loadConfigFile
  );
  return (
    <Wrapper>
      <Title divider>Serial</Title>
      <Title size={1}>Chrome based browsers only!</Title>
      <Title size={1}>As long as you see this message, you have to</Title>
      <Title size={1}>
        use the freedeck-ino develop branch or it wont work
      </Title>
      <Divider />
      <Row>
        <Label>Connect:</Label>
        <FDButton px={5} py={5} size={1} onClick={() => connectSerial()}>
          Connect
        </FDButton>
      </Row>
      <Row>
        <Label>Read config from FreeDeck:</Label>
        <FDButton
          px={5}
          py={5}
          size={1}
          disabled={!ready}
          onClick={async () => setFileSize(await readConfigFromSerial())}
        >
          Read
        </FDButton>
      </Row>
      <Row>
        <Label>Write config to FreeDeck:</Label>
        <FDButton
          disabled={!ready}
          px={5}
          py={5}
          size={1}
          onClick={() => writeConfigOverSerial()}
        >
          Write
        </FDButton>
      </Row>

      <Divider />
      <Row>
        <Label>Progress:</Label>
        {progress && <Value>{Math.floor(progress * 100)}%</Value>}
      </Row>
      <Row>
        <Label>Duration:</Label>
        {duration && <Value>{duration / 1000}s</Value>}
      </Row>
      <Row>
        <Label>Speed:</Label>
        {duration && fileSize && (
          <Value>{(fileSize / duration).toFixed(0)}kb/s</Value>
        )}
      </Row>
    </Wrapper>
  );
};
