import React from "react";
import { useNavigate } from "react-router";

import { Divider } from "../lib/components/Divider";
import { FDWindow } from "../lib/components/Window";

export const HelpModal: React.FC<{}> = () => {
  const nav = useNavigate();

  return (
    <FDWindow
      className="w-auto h-auto"
      visible={true}
      setClose={() => {
        nav("/");
      }}
      title="Help"
    >
      <div className="flex flex-col items-center space-y-4 p-8 text-xl">
        <div className="text-4xl">FreeDeck Companion App?</div>
        <a
          href="https://github.com/FreeYourStream/freedeck-configurator-companion/tree/main#download"
          className="text-primary-500"
        >
          here
        </a>
        <Divider />
        <div className="text-4xl">Old Configurator?</div>
        <a href="https://fdold.freeyourstream.com" className="text-primary-500">
          here
        </a>
      </div>
    </FDWindow>
  );
};
