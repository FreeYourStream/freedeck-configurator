import {
  ArrowCircleLeftIcon,
  ChipIcon,
  InformationCircleIcon,
  SunIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import React from "react";
import styled from "styled-components";
import { Modal } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { About } from "../containers/About";
import { Brightness } from "./Brightness";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { Device } from "../containers/Device";
import { Serial } from "../containers/Serial";

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
}> = ({
  setClose,
  onClose,
  loadConfigFile,
  getConfigBuffer,
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
          {
            title: "Default back button",
            prefix: <ArrowCircleLeftIcon className="h-6 w-6" />,
            content: <DefaultBackButtonSettings />,
          },
          {
            title: "Displays",
            prefix: <SunIcon className="h-6 w-6" />,
            content: <Brightness />,
          },
          {
            title: "Serial",
            prefix: <SwitchVerticalIcon className="h-6 w-6" />,
            content: (
              <Serial
                getConfigBuffer={getConfigBuffer}
                loadConfigFile={loadConfigFile}
                readyToSave={readyToSave}
              />
            ),
          },
          {
            title: "Device",
            prefix: <ChipIcon className="h-6 w-6" />,
            content: <Device />,
          },
          {
            title: "About",
            prefix: <InformationCircleIcon className="h-6 w-6" />,
            content: <About />,
          },
        ]}
      />
    </Modal>
  );
};
