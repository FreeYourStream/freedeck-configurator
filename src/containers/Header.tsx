import {
  CheckIcon,
  CogIcon,
  DownloadIcon,
  SaveIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { iconSize } from "../definitions/iconSizes";
import { FDButton } from "../lib/components/Button";
import { Value } from "../lib/components/LabelValue";
import { FDSelect } from "../lib/components/SelectInput";
import { createConfigBuffer } from "../lib/configFile/createBuffer";
import { loadConfigFile } from "../lib/configFile/loadConfigFile";
import { download } from "../lib/download";
import { isMacOS } from "../lib/util";
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
  const { serialApi, ctrlDown, availablePorts, connectedPortIndex } =
    useContext(AppStateContext);
  const nav = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const loadConfigRef = useRef<HTMLInputElement | null>(null);
  const saveConfigFile = () => {
    if (Object.keys(pages.byId).length === 0) return;
    const completeBuffer = createConfigBuffer(configState);

    completeBuffer && download(completeBuffer);
  };
  const deviceEntries = [
    { text: "Disconnected", value: -1 },
    ...availablePorts.map((port, index) => ({
      text: port.replace(";", " "),
      value: index,
    })),
  ];
  if (!(window as any).__TAURI_IPC__)
    deviceEntries.push({ text: "Connect new...", value: -2 });
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
            {serialApi?.connected && !ctrlDown ? (
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
                  {progress > 0 && progress < 1 && (
                    <div
                      className="w-24 flex justify-between items-center"
                      title={`${
                        isMacOS ? "Sorry, very slow on mac :(" : "working"
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full animate-spin bg-primary-500">
                        <div className="h-4 w-4  rounded-tl-full bg-primary-200 relative">
                          <div className="absolute h-5 w-5 -bottom-2.5 -right-2.5 bg-primary-500 rounded-full" />
                        </div>
                      </div>
                      <div>{`${(progress * 100).toFixed(0)}%`}</div>
                    </div>
                  )}
                  {progress === 1 && (
                    <div className="bg-success-700 h-8 w-8 rounded-full flex justify-center items-center">
                      <CheckIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
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
              </>
            )}
            {serialApi && (
              <FDSelect
                options={deviceEntries}
                value={connectedPortIndex}
                onChange={(value) => {
                  switch (value) {
                    case -1:
                      serialApi?.disconnect();
                      break;
                    case -2:
                      serialApi?.requestNewPort().catch((e) => console.log(e));
                      break;
                    default:
                      serialApi?.connect(value);
                      break;
                  }
                }}
              />
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
            <LoginLogoutButtons />
          )}
          {process.env.REACT_APP_API_COMING_SOON === "true" && (
            <FDButton
              onClick={() =>
                (document.location = "https://fddev.freeyourstream.com")
              }
              size={3}
              title="Use the beta version to get a sneak peek"
            >
              FreeDeck Hub - Coming soon!
            </FDButton>
          )}
        </div>
      </div>
    </div>
  );
};
