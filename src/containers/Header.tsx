import {
  CogIcon,
  DownloadIcon,
  LightningBoltIcon,
  LogoutIcon,
  SaveIcon,
  UploadIcon,
  UserIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useUser } from "../graphql/hooks/useUser";
import { Avatar } from "../lib/components/Avatar";
import { FDButton } from "../lib/components/Button";
import { Value } from "../lib/components/Misc";
import { connectionStatus } from "../lib/serial";
import { AppStateContext } from "../states/appState";
import { ConfigStateContext } from "../states/configState";

const iconSize = "w-5 h-5";

const LoginLogoutButtons: React.FC<{
  openLogin: () => void;
  openFDHub: () => void;
}> = ({ openLogin, openFDHub }) => {
  const { user, error } = useUser();
  if (user) {
    return (
      <>
        <FDButton
          prefix={<Avatar src={user.avatar} />}
          onClick={() => openFDHub()}
        >
          {user.displayName}
        </FDButton>
        <FDButton
          prefix={<LogoutIcon className={iconSize} />}
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/logout`)
          }
        >
          {user.displayName}
        </FDButton>
      </>
    );
  }
  return (
    <FDButton
      prefix={<UserIcon className={iconSize} />}
      onClick={() => openLogin()}
    >
      Login
    </FDButton>
  );
};

export const Header: React.FC<{
  loadConfigFile: (filesOrBuffer: Buffer | FileList) => void;
  saveConfigFile: () => void;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  createConfigBuffer: () => Promise<Buffer>;
  openLogin: () => void;
}> = ({
  loadConfigFile,
  saveConfigFile,
  setShowSettings,
  createConfigBuffer,
  openLogin,
}) => {
  const { buttonSettingsPages } = useContext(ConfigStateContext);
  const { serialApi, ctrlDown } = useContext(AppStateContext);
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
  return (
    <div
      id="header"
      className={c("bg-gray-700 flex h-20 items-center px-10 shadow-2xl")}
    >
      <div className={c("flex mr-12")}>
        <div className={c("font-thin text-5xl text-white")}>Free</div>
        {/*"font-thin text-5xl text-white "/*/}
        {/*"font-thin text-5xl bg-gradient-to-br from-red-100 to-gray-400 rounded-sm"*/}
        <div className={c("font-medium text-5xl text-white")}>Deck</div>
      </div>
      <div className={c("flex h-14 justify-between items-center w-full")}>
        <form
          className="flex items-center space-x-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className={c("flex items-center space-x-4 h-auto")}>
            {connected && !ctrlDown ? (
              <>
                <FDButton
                  prefix={<UploadIcon className={iconSize} />}
                  size={2}
                  onClick={() =>
                    serialApi!
                      .readConfigFromSerial((rec, size) =>
                        setProgress(rec / size)
                      )
                      .then(loadConfigFile)
                  }
                >
                  Load from FreeDeck
                </FDButton>
                <FDButton
                  prefix={<SaveIcon className={iconSize} />}
                  size={2}
                  onClick={async () =>
                    serialApi!.writeConfigOverSerial(
                      await createConfigBuffer(),
                      (rec, size) => setProgress(rec / size)
                    )
                  }
                >
                  Save to FreeDeck
                </FDButton>
                <Value ml={16}>
                  {progress ? `${(progress * 100).toFixed(0)}%` : ""}
                </Value>
              </>
            ) : (
              <>
                <FDButton
                  prefix={<UploadIcon className={iconSize} />}
                  size={2}
                  onClick={() => loadConfigRef.current?.click()}
                >
                  Load Config
                </FDButton>
                <input
                  className={c("hidden")}
                  type="file"
                  id="loadConfig"
                  ref={loadConfigRef}
                  onChange={(event) =>
                    event.currentTarget.files &&
                    loadConfigFile(event.currentTarget.files)
                  }
                ></input>
                {!!buttonSettingsPages.length && (
                  <FDButton
                    prefix={<DownloadIcon className={iconSize} />}
                    disabled={!buttonSettingsPages.length}
                    size={2}
                    onClick={() => saveConfigFile()}
                  >
                    Save Config
                  </FDButton>
                )}
                {serialApi && !serialApi.connected && (
                  <FDButton
                    prefix={<LightningBoltIcon className={iconSize} />}
                    size={2}
                    onClick={() => serialApi.connect()}
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
            size={2}
            onClick={() => setShowSettings(true)}
          >
            Settings
          </FDButton>
          {process.env.REACT_APP_ENABLE_API === "true" && (
            <LoginLogoutButtons
              openLogin={openLogin}
              openFDHub={() => console.log("OPEN FD HUB")}
            />
          )}
        </div>
      </div>
    </div>
  );
};
