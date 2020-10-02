import React from "react";
import styled from "styled-components";

import { IDefaultBackDisplay } from "../App";
import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { About } from "./About";
import { Brightness } from "./Brightness";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { Serial } from "./Serial";

export const Activator = styled.div<{ visible: boolean }>`
  display: ${(p) => (p.visible ? "flex" : "none")};
  flex-direction: column;
`;
export const GlobalSettings: React.FC<{
  setClose: () => void;
  defaultBackDisplay: IDefaultBackDisplay;
  onClose: () => void;
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Buffer;
  brightness: number;
  visible?: boolean;
  readyToSave: boolean;
}> = ({
  setClose,
  defaultBackDisplay,
  setDefaultBackDisplay,
  setBrightness,
  onClose,
  loadConfigFile,
  getConfigBuffer,
  brightness,
  visible,
  readyToSave,
}) => {
  return (
    <Modal
      visible={visible}
      setClose={() => {
        onClose();
        setClose();
      }}
      minWidth={650}
      minHeight={720}
      title="General settings"
    >
      <TabView
        tabs={[
          "Default back button",
          "Brightness (Beta)",
          "Serial (Beta)",
          "About",
        ]}
        renderTab={(tab) => {
          return (
            <ModalBody>
              <Activator visible={tab === "Default back button"}>
                <DefaultBackButtonSettings
                  defaultBackDisplay={defaultBackDisplay}
                  setDefaultBackDisplay={setDefaultBackDisplay}
                />
              </Activator>
              <Activator visible={tab === "Brightness (Beta)"}>
                <Brightness
                  brightness={brightness}
                  setBrightness={setBrightness}
                />
              </Activator>
              <Activator visible={tab === "Serial (Beta)"}>
                <Serial
                  getConfigBuffer={getConfigBuffer}
                  loadConfigFile={loadConfigFile}
                  readyToSave={readyToSave}
                />
              </Activator>
              <Activator visible={tab === "About"}>
                <About />
              </Activator>
            </ModalBody>
          );
        }}
      />
    </Modal>
  );
};
