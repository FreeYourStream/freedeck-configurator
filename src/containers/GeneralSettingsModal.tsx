import {
  ArrowCircleLeftIcon,
  ChipIcon,
  CodeIcon,
  InformationCircleIcon,
  SunIcon,
  SwitchVerticalIcon,
} from "@heroicons/react/outline";
import React, { useContext } from "react";
import { useNavigate } from "react-router";

import { TabView } from "../lib/components/TabView";
import { FDWindow } from "../lib/components/Window";
import { ConfigDispatchContext } from "../states/configState";
import { About } from "./About";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { DeveloperSettings } from "./DeveloperSettings";
import { Device } from "./Device";
import { Displays } from "./Displays";
import { Serial } from "./Serial";

export const GlobalSettings: React.FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const nav = useNavigate();
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
      title: "Developer settings",
      prefix: <CodeIcon className="h-6 w-6" />,
      content: <DeveloperSettings />,
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
      content: <Serial />,
    });
  return (
    <FDWindow
      className="w-dp-settings"
      visible={true}
      setClose={() => {
        nav("/");
        configDispatch.updateAllDefaultBackImages(undefined);
      }}
      title="General settings"
    >
      <TabView tabs={tabs} className="h-dp-settings" />
    </FDWindow>
  );
};
