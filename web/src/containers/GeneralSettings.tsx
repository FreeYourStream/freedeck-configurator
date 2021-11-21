import {
  ArrowCircleLeftIcon,
  ChipIcon,
  InformationCircleIcon,
  SunIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import React, { useContext } from "react";

import { TabView } from "../lib/components/TabView";
import { FDWindow } from "../lib/components/Window";
import { AppDispatchContext, AppStateContext } from "../states/appState";
import { ConfigDispatchContext } from "../states/configState";
import { About } from "./About";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { Device } from "./Device";
import { Displays } from "./Displays";
import { Serial } from "./Serial";

export const GlobalSettings: React.FC<{
  loadConfigFile: (buffer: Buffer) => void;
  getConfigBuffer: () => Promise<Buffer>;
}> = ({ loadConfigFile, getConfigBuffer }) => {
  const { showSettings } = useContext(AppStateContext);
  const { setShowSettings } = useContext(AppDispatchContext);
  const configDispatch = useContext(ConfigDispatchContext);
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
        />
      ),
    });
  return (
    <FDWindow
      className="w-dp-settings"
      visible={showSettings}
      setClose={() => {
        setShowSettings(false);
        configDispatch.updateAllDefaultBackImages(undefined);
      }}
      title="General settings"
    >
      <TabView tabs={tabs} className="h-dp-settings" />
    </FDWindow>
  );
};
