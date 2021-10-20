import {
  ArrowCircleLeftIcon,
  ChipIcon,
  InformationCircleIcon,
  SunIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import React from "react";
import { About } from "./About";
import { Displays } from "./Brightness";
import { Device } from "./Device";
import { Serial } from "./Serial";
import { Modal } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";

export const GlobalSettings: React.FC<{
  setClose: () => void;
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Promise<Buffer>;
  visible?: boolean;
  readyToSave: boolean;
}> = ({ setClose, loadConfigFile, getConfigBuffer, visible, readyToSave }) => {
  return (
    <Modal
      className="w-modal"
      visible={visible}
      setClose={setClose}
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
            content: <Displays />,
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
