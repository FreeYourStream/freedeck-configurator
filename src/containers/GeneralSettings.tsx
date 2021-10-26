import {
  ArrowCircleLeftIcon,
  ChipIcon,
  InformationCircleIcon,
  SunIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import React from "react";
import { About } from "./About";
import { Displays } from "./Displays";
import { Device } from "./Device";
import { Serial } from "./Serial";
import { Window } from "../lib/components/Window";
import { TabView } from "../lib/components/TabView";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";

export const GlobalSettings: React.FC<{
  setClose: () => void;
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Promise<Buffer>;
  visible?: boolean;
  readyToSave: boolean;
}> = ({ setClose, loadConfigFile, getConfigBuffer, visible, readyToSave }) => {
  const tabs = [
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
      title: "Device",
      prefix: <ChipIcon className="h-6 w-6" />,
      content: <Device />,
    },
    {
      title: "About",
      prefix: <InformationCircleIcon className="h-6 w-6" />,
      content: <About />,
    },
  ];
  if ((window as any).Serial)
    tabs.splice(2, 0, {
      title: "Serial",
      prefix: <SwitchVerticalIcon className="h-6 w-6" />,
      content: (
        <Serial
          getConfigBuffer={getConfigBuffer}
          loadConfigFile={loadConfigFile}
          readyToSave={readyToSave}
        />
      ),
    });
  return (
    <Window
      className="w-dp-settings"
      visible={visible}
      setClose={setClose}
      title="General settings"
    >
      <TabView tabs={tabs} className="h-dp-settings" />
    </Window>
  );
};
