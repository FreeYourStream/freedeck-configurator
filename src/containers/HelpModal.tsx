import React from "react";
import { useNavigate } from "react-router";
import { Anchor } from "../lib/components/Anchor";
import { TitleBox } from "../lib/components/Title";
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
      <div className="space-y-4 p-8 text-xl w-max">

        <TitleBox title="FreeDeck App?" >
          <Anchor newTab
            href="https://github.com/FreeYourStream/freedeck-configurator/releases"
            className="text-primary-500"
          >
            here
          </Anchor>
        </TitleBox>
        <TitleBox title="Old Configurator?">
          <Anchor newTab href="https://fdold.freeyourstream.com" className="text-primary-500">
            here
          </Anchor>
        </TitleBox>

      </div>
    </FDWindow>
  );
};
