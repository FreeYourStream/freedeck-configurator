import {
  ArrowLeftCircleIcon,
  ChartBarIcon,
  CodeBracketIcon,
  CpuChipIcon,
  InformationCircleIcon,
  SunIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { useNavigate } from "react-router";

import { TabView } from "../lib/components/TabView";
import { FDWindow } from "../lib/components/Window";
import { ConfigDispatchContext } from "../states/configState";
import { About } from "./About";
import { BackButtonLiveData } from "./BackButtonLiveData";
import { DefaultBackButtonSettings } from "./DefaultBackButtonSettings";
import { DeveloperSettings } from "./DeveloperSettings";
import { Device } from "./Device";
import { Displays } from "./Displays";

export const GlobalSettings: React.FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const nav = useNavigate();
  const tabs = [
    {
      title: "Default back button",
      prefix: <ArrowLeftCircleIcon className="h-6 w-6" />,
      content: <DefaultBackButtonSettings />,
    },
    {
      title: "Back button live data",
      prefix: <ChartBarIcon className="h-6 w-6" />,
      content: <BackButtonLiveData />,
    },
    // {
    //   title: "Auto page switcher",
    //   prefix: <WindowIcon className="h-6 w-6" />,
    //   content: <BackButtonLiveData />,
    // },
    {
      title: "Displays",
      prefix: <SunIcon className="h-6 w-6" />,
      content: <Displays />,
    },
    {
      title: "Device",
      prefix: <CpuChipIcon className="h-6 w-6" />,
      content: <Device />,
    },
    {
      title: "Developer settings",
      prefix: <CodeBracketIcon className="h-6 w-6" />,
      content: <DeveloperSettings />,
    },
    {
      title: "About",
      prefix: <InformationCircleIcon className="h-6 w-6" />,
      content: <About />,
    },
  ];
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
      <TabView tabs={tabs} className="h-settings" />
    </FDWindow>
  );
};
