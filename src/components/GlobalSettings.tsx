import React from "react";
import styled from "styled-components";

import { IDefaultBackDisplay } from "../App";
import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { About } from "./About";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";

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
}> = ({ setClose, defaultBackDisplay, setDefaultBackDisplay, onClose }) => {
  return (
    <Modal
      setClose={() => {
        onClose();
        setClose();
      }}
      minWidth={650}
      minHeight={670}
      title="Global settings"
    >
      <TabView
        tabs={["Default back button", "About"]}
        renderTab={(tab) => {
          return (
            <ModalBody>
              <Activator visible={tab === "Default back button"}>
                <DefaultBackButtonSettings
                  defaultBackDisplay={defaultBackDisplay}
                  setDefaultBackDisplay={setDefaultBackDisplay}
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
