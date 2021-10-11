import React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { About } from "./About";
import { Brightness } from "./Brightness";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { Device } from "./Device";
import { Serial } from "./Serial";

export const Activator = styled.div<{ visible: boolean }>`
  display: ${(p) => (p.visible ? "flex" : "none")};
  flex-direction: column;
`;
export const GlobalSettings: React.FC<{
  setClose: () => void;
  onClose: () => void;

  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Promise<Buffer>;
  visible?: boolean;
  readyToSave: boolean;
  serialApi?: FDSerialAPI;
}> = ({
  setClose,
  onClose,
  loadConfigFile,
  getConfigBuffer,
  visible,
  readyToSave,
  serialApi,
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
          "Device",
          "About",
        ]}
        renderTab={(tab) => {
          return (
            <ModalBody>
              <Activator visible={tab === "Default back button"}>
                <DefaultBackButtonSettings />
              </Activator>
              <Activator visible={tab === "Brightness (Beta)"}>
                <Brightness />
              </Activator>

              <Activator visible={tab === "Serial (Beta)"}>
                <Serial
                  getConfigBuffer={getConfigBuffer}
                  loadConfigFile={loadConfigFile}
                  readyToSave={readyToSave}
                  serialApi={serialApi}
                />
              </Activator>
              <Activator visible={tab === "Device"}>
                <Device serialApi={serialApi} />
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
