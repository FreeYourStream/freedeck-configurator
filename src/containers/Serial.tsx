import React, { useCallback, useContext, useEffect, useState } from "react";

import { FDButton } from "../lib/components/Button";
import { Divider } from "../lib/components/Divider";
import { Label, Value } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { Title } from "../lib/components/Title";
import { createConfigBuffer } from "../lib/configFile/createBuffer";
import { loadConfigFile } from "../lib/configFile/loadConfigFile";
import { connectionStatus } from "../lib/serial";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

export const Serial: React.FC<{}> = () => {
  const { serialApi } = useContext(AppStateContext);
  const configState = useContext(ConfigStateContext);
  const { setState } = useContext(ConfigDispatchContext);
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
    } catch (e: any) {
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
      <Title>Serial</Title>
      <Row>
        <Label>Connect:</Label>
        <FDButton
          className="w-24 justify-center"
          type="primary"
          size={1}
          disabled={
            !serialApi || serialApi.connected === connectionStatus.connect
          }
          onClick={() => connectSerial()}
          title={
            serialApi?.connected === connectionStatus.connect
              ? "Already connected"
              : ""
          }
        >
          Connect
        </FDButton>
      </Row>
      <Row>
        <Label>Read config from FreeDeck:</Label>
        <FDButton
          className="w-24 justify-center"
          size={1}
          disabled={!connected}
          onClick={async () =>
            loadConfigFile(
              await serialApi!.readConfigFromSerial(progressCallback),
              setState
            )
          }
        >
          Read
        </FDButton>
      </Row>
      <Row>
        <Label>Write config to FreeDeck:</Label>
        <FDButton
          className="w-24 justify-center"
          disabled={!connected || !configState.pages.byId.length}
          size={1}
          onClick={async () =>
            serialApi!.writeConfigOverSerial(
              createConfigBuffer(configState),
              progressCallback
            )
          }
        >
          Write
        </FDButton>
      </Row>
      <Row>
        <Label>Test:</Label>
        <FDButton
          className="w-24 justify-center"
          size={1}
          disabled={!connected}
          onClick={async () => await serialApi!.setCurrentPage(4)}
        >
          set page
        </FDButton>
      </Row>

      <Divider />
      <Title>Transmission Stats</Title>
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
