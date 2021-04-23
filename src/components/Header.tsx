import styled from "styled-components";
import { colors } from "../definitions/colors";
import React, { useEffect, useState } from "react";
import { FDButton, FDIconButton } from "../lib/components/Button";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { HiDocumentAdd } from "react-icons/hi";
import { connectionStatus } from "../lib/serial";
import { Value } from "../lib/components/Misc";
import { useUser } from "../graphql/hooks/useUser";
import { Avatar } from "../lib/components/Avatar";

const Wrapper = styled.div`
  background-color: ${colors.gray};
  border-bottom: 1px solid ${colors.black};
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  padding: 18px;
`;

const HeadLine = styled.div`
  display: flex;
`;

const HeadLineThin = styled.div`
  color: white;
  font-family: "Barlow", sans-serif;
  font-size: 36px;
  font-weight: 100;
`;
const HeadLineThick = styled.div`
  color: white;
  font-family: "Barlow", sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  height: 52px;
  justify-content: space-between;
`;

const Horiz = styled.div`
  display: flex;
  align-items: center;
`;

const InvisibleFile = styled.input.attrs({ type: "file" })`
  display: none;
`;

const DisplayName = styled.div`
  margin-left: 4px;
`;

const LoginLogoutButtons: React.FC<{
  openLogin: () => void;
  openFDHub: () => void;
}> = ({ openLogin, openFDHub }) => {
  const { user, loading, error } = useUser();
  if (user) {
    return (
      <>
        <FDButton ml={5} onClick={() => openFDHub()}>
          <Avatar src={user.avatar} />
          <DisplayName>{user.displayName}</DisplayName>
        </FDButton>
        <FDIconButton
          type="danger"
          icon="ri/RiLogoutBoxLine"
          ml={5}
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/logout`)
          }
        ></FDIconButton>
      </>
    );
  } else if (error) {
    return (
      <FDIconButton icon="bi/BiUser" ml={5} onClick={() => openLogin()}>
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
  createConfigBuffer: () => Buffer;
  openLogin: () => void;
  serialApi?: FDSerialAPI;
}> = ({
  loadConfigFile,
  saveConfigFile,
  serialApi,
  setShowSettings,
  createConfigBuffer,
  openLogin,
}) => {
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
    <Wrapper id="header">
      <HeadLine>
        <HeadLineThin>Free</HeadLineThin>
        <HeadLineThick>Deck</HeadLineThick>
        <HeadLineThick>{connected}</HeadLineThick>
      </HeadLine>
      <Buttons>
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {connected ? (
            <Horiz>
              <FDIconButton
                icon="fa/FaDownload"
                ml={4}
                size={3}
                onClick={() =>
                  serialApi!
                    .readConfigFromSerial((rec, size) =>
                      setProgress(rec / size)
                    )
                    .then(loadConfigFile)
                }
              >
                Download Config (Serial)
              </FDIconButton>
              <FDIconButton
                icon="fa/FaUpload"
                ml={4}
                size={3}
                onClick={() =>
                  serialApi!.writeConfigOverSerial(
                    createConfigBuffer(),
                    (rec, size) => setProgress(rec / size)
                  )
                }
              >
                Upload Config (Serial)
              </FDIconButton>
              <Value ml={16}>
                {progress ? `${(progress * 100).toFixed(0)}%` : ""}
              </Value>
            </Horiz>
          ) : (
            <Horiz>
              <FDIconButton
                size={3}
                icon={"fa/FaFileUpload"}
                htmlFor="loadConfig"
              >
                Load Config
              </FDIconButton>
              <InvisibleFile
                id="loadConfig"
                onChange={(event) =>
                  event.currentTarget.files &&
                  loadConfigFile(event.currentTarget.files)
                }
              ></InvisibleFile>
              <FDIconButton
                icon="fa/FaSave"
                ml={4}
                size={3}
                onClick={() => saveConfigFile()}
              >
                Save Config
              </FDIconButton>
            </Horiz>
          )}
        </form>
        <Horiz>
          <FDIconButton
            ml={5}
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
        </Horiz>
      </Buttons>
    </Wrapper>
  );
};
