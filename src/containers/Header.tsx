import c from "clsx";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "../definitions/colors";
import { useUser } from "../graphql/hooks/useUser";
import { Avatar } from "../lib/components/Avatar";
import { FDButton, FDIconButton } from "../lib/components/Button";
import { Value } from "../lib/components/Misc";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { connectionStatus } from "../lib/serial";
import { AppStateContext } from "../states/appState";

const LoginLogoutButtons: React.FC<{
  openLogin: () => void;
  openFDHub: () => void;
}> = ({ openLogin, openFDHub }) => {
  const { user, error } = useUser();
  if (user) {
    return (
      <>
        <FDButton onClick={() => openFDHub()}>
          <Avatar src={user.avatar} />
          <div className={c("ml-1")}>{user.displayName}</div>
        </FDButton>
        <FDIconButton
          type="danger"
          icon="ri/RiLogoutBoxLine"
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/logout`)
          }
        ></FDIconButton>
      </>
    );
  } else if (error) {
    return (
      <FDIconButton icon="bi/BiUser" onClick={() => openLogin()}>
        Login
      </FDIconButton>
    );
  }
  return <></>;
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
  const { serialApi, ctrlDown } = useContext(AppStateContext);
  const [connected, setConnected] = useState<boolean>(!!serialApi?.connected);
  const [progress, setProgress] = useState<number>(0);
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
      className={c("bg-gray-900 border-b-2 border-gray-600 flex p-4")}
    >
      <div className={c("flex mr-8")}>
        <div className={c("font-thin text-5xl text-white")}>Free</div>
        <div className={c("font-medium text-5xl text-white")}>Deck</div>
      </div>
      <div className={c("flex h-14 justify-between items-center w-full")}>
        <form
          className="flex items-center"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className={c("grid grid-cols-2 grid-rows-1 gap-x-4 h-auto")}>
            {connected && !ctrlDown ? (
              <>
                <FDIconButton
                  icon="fa/FaDownload"
                  size={2}
                  onClick={() =>
                    serialApi!
                      .readConfigFromSerial((rec, size) =>
                        setProgress(rec / size)
                      )
                      .then(loadConfigFile)
                  }
                >
                  Download Config
                </FDIconButton>
                <FDIconButton
                  icon="fa/FaUpload"
                  size={2}
                  onClick={async () =>
                    serialApi!.writeConfigOverSerial(
                      await createConfigBuffer(),
                      (rec, size) => setProgress(rec / size)
                    )
                  }
                >
                  Upload Config
                </FDIconButton>
                <Value ml={16}>
                  {progress ? `${(progress * 100).toFixed(0)}%` : ""}
                </Value>
              </>
            ) : (
              <>
                <FDIconButton
                  size={2}
                  icon={"fa/FaFileUpload"}
                  htmlFor="loadConfig"
                >
                  Load Config
                </FDIconButton>
                <input
                  className={c("hidden")}
                  type="file"
                  id="loadConfig"
                  onChange={(event) =>
                    event.currentTarget.files &&
                    loadConfigFile(event.currentTarget.files)
                  }
                ></input>
                <FDIconButton
                  icon="fa/FaSave"
                  size={2}
                  onClick={() => saveConfigFile()}
                >
                  Save Config
                </FDIconButton>
              </>
            )}
          </div>
        </form>
        <div className={c("grid grid-cols-2 grid-rows-1 gap-x-4")}>
          <FDIconButton
            icon="ai/AiFillSetting"
            onClick={() => setShowSettings(true)}
          >
            Settings
          </FDIconButton>
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
