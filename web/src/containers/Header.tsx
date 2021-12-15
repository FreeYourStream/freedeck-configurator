import {
  CogIcon,
  DownloadIcon,
  LightningBoltIcon,
  SaveIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { iconSize } from "../definitions/iconSizes";
import { FDButton } from "../lib/components/Button";
import { Value } from "../lib/components/LabelValue";
import { createConfigBuffer } from "../lib/configFile/createBuffer";
import { loadConfigFile } from "../lib/configFile/loadConfigFile";
import { download } from "../lib/download";
import { connectionStatus } from "../lib/serial";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { LoginLogoutButtons } from "./LoginButton";

export const Header: React.FC<{}> = () => {
  const configState = useContext(ConfigStateContext);
  const { pages } = configState;
  const { setState } = useContext(ConfigDispatchContext);
  const { serialApi, ctrlDown } = useContext(AppStateContext);
  const nav = useNavigate();
  const [connected, setConnected] = useState<boolean>(!!serialApi?.connected);
  const [progress, setProgress] = useState<number>(0);
  const loadConfigRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!serialApi) return;
    const id = serialApi.registerOnConStatusChange((type) => {
      setConnected(type === connectionStatus.connect);
    });

    return () => serialApi.clearOnConStatusChange(id);
  }, [serialApi]);

  const saveConfigFile = () => {
    if (Object.keys(pages.byId).length === 0) return;
    const completeBuffer = createConfigBuffer(configState);

    completeBuffer && download(completeBuffer);
  };
  return (
    <div
      id="header"
      className={c(
        "border-b-2 border-gray-600 bg-gray-700 flex h-24 w-full items-center px-10 shadow-2xl"
      )}
    >
      <div className={c("flex mr-12")}>
        <div className={c("font-thin text-5xl text-white font-fd")}>Free</div>
        {/*"font-thin text-5xl text-white "/*/}
        {/*"font-thin text-5xl bg-gradient-to-br from-red-100 to-gray-400 rounded-sm"*/}
        <div className={c("font-medium text-5xl text-white font-fd")}>Deck</div>
      </div>
      <div className={c("flex h-14 justify-between items-center w-full")}>
        <form
          className="flex items-center space-x-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <input
            title="loadConfig"
            className={c("hidden")}
            type="file"
            id="loadConfig"
            ref={loadConfigRef}
            onChange={(event) => {
              event.currentTarget.files &&
                loadConfigFile(event.currentTarget.files, setState);
            }}
          ></input>
          <div
            className={c("flex items-center space-x-4 h-auto overflow-hidden")}
          >
            {connected && !ctrlDown ? (
              <>
                <FDButton
                  prefix={<UploadIcon className={iconSize} />}
                  size={3}
                  onClick={() =>
                    serialApi!
                      .readConfigFromSerial((rec, size) =>
                        setProgress(rec / size)
                      )
                      .then((data) => loadConfigFile(data, setState))
                  }
                >
                  Load from FreeDeck
                </FDButton>
                <FDButton
                  prefix={<SaveIcon className={iconSize} />}
                  size={3}
                  onClick={async () =>
                    serialApi!.writeConfigOverSerial(
                      createConfigBuffer(configState),
                      (rec, size) => setProgress(rec / size)
                    )
                  }
                >
                  Save to FreeDeck
                </FDButton>
                <Value className="ml-4">
                  {progress ? `${(progress * 100).toFixed(0)}%` : ""}
                </Value>
              </>
            ) : (
              <>
                <FDButton
                  prefix={<UploadIcon className={iconSize} />}
                  size={3}
                  onClick={() => {
                    loadConfigRef.current?.click();
                  }}
                >
                  Load Config
                </FDButton>

                {!!Object.keys(pages).length && (
                  <FDButton
                    prefix={<DownloadIcon className={iconSize} />}
                    disabled={!Object.keys(pages).length}
                    size={3}
                    onClick={() => saveConfigFile()}
                  >
                    Save Config
                  </FDButton>
                )}
                {serialApi && !serialApi.connected && (
                  <FDButton
                    prefix={<LightningBoltIcon className={iconSize} />}
                    size={3}
                    onClick={() =>
                      serialApi.connect().catch((e) => console.log(e))
                    }
                  >
                    Connect to FreeDeck
                  </FDButton>
                )}
              </>
            )}
          </div>
        </form>
        <div className={c("flex items-center space-x-4")}>
          <FDButton
            prefix={<CogIcon className={iconSize} />}
            onClick={() => nav("/settings")}
            size={3}
          >
            Settings
          </FDButton>

          {process.env.REACT_APP_ENABLE_API === "true" && (
            <LoginLogoutButtons
              openLogin={() => nav("/login")}
              openFDHub={() => nav("/hub")}
            />
          )}
        </div>
      </div>
    </div>
  );
};
