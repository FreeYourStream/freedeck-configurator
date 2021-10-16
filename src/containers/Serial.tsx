import React, { useCallback, useEffect, useState } from "react";
import { FDButton } from "../lib/components/Button";
import { Label, Value } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { Title } from "../lib/components/Title";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { connectionStatus } from "../lib/serial";

export const Serial: React.FC<{
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Promise<Buffer>;
  readyToSave: boolean;
  serialApi?: FDSerialAPI;
}> = ({ loadConfigFile, getConfigBuffer, readyToSave, serialApi }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [connected, setConnected] = useState<boolean>(!!serialApi?.connected);
  useEffect(() => {
    if (!serialApi) return;
    const id = serialApi.registerOnConStatusChange((type) => {
      setConnected(type === connectionStatus.connect);
    });

    return () => serialApi.clearOnConStatusChange(id);
  }, [serialApi]);

  const connectSerial = useCallback(async () => {
    if (!serialApi) return;
    try {
      await serialApi.connect();
      setConnected(true);
    } catch (e) {
      console.log(e);
      if (e.message === "No port selected by the user") return;
    }
  }, [serialApi]);

  const progressCallback = useCallback(
    (received: number, fileSize: number, started: number) => {
      setProgress(received / fileSize);
      setDuration(new Date().getTime() - started);
      setFileSize(fileSize);
    },
    [setProgress]
  );
  return (
    <div className="w-full">
      <Title>Serial {connected ? "connected" : "not connected"}</Title>
      <Title>Chrome based browsers only!</Title>
      {/* <Divider /> */}
      <Row>
        <Label>Connect:</Label>
        <FDButton
          type="primary"
          size={1}
          disabled={!serialApi}
          onClick={() => connectSerial()}
        >
          Connect
        </FDButton>
      </Row>
      <Row>
        <Label>Read config from FreeDeck:</Label>
        <FDButton
          size={1}
          disabled={!connected}
          onClick={async () =>
            loadConfigFile(
              await serialApi!.readConfigFromSerial(progressCallback)
            )
          }
        >
          Read
        </FDButton>
      </Row>
      <Row>
        <Label>Write config to FreeDeck:</Label>
        <FDButton
          disabled={!connected || !readyToSave}
          size={1}
          onClick={async () =>
            serialApi!.writeConfigOverSerial(
              await getConfigBuffer(),
              progressCallback
            )
          }
        >
          Write
        </FDButton>
      </Row>

      {/* <Divider /> */}
      <Row>
        <Label>Progress:</Label>
        {progress !== null && (
          <Value>{Math.min(Math.ceil(progress * 100), 100)}%</Value>
        )}
      </Row>
      <Row>
        <Label>Duration:</Label>
        {duration !== null && <Value>{(duration / 1000).toFixed(1)}s</Value>}
      </Row>
      <Row>
        <Label>Config size:</Label>
        {fileSize !== null && <Value>{(fileSize / 1024).toFixed(0)}kb</Value>}
      </Row>
      <Row>
        <Label>Speed:</Label>
        {duration !== null && fileSize !== null && progress !== null && (
          <Value>{((fileSize / duration) * progress).toFixed(0)}kb/s</Value>
        )}
      </Row>
    </div>
  );
};
