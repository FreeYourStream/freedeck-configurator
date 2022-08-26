import React from "react";
import { useNavigate } from "react-router";

import { Anchor } from "../lib/components/Anchor";
import { CtrlDuo } from "../lib/components/CtrlDuo";
import { TitleBox } from "../lib/components/Title";
import { FDWindow } from "../lib/components/Window";

export const HelpModal: React.FC<{}> = () => {
  const nav = useNavigate();

  return (
    <FDWindow
      className="w-help h-full"
      visible={true}
      setClose={() => {
        nav("/");
      }}
      title="Help"
    >
      <div className="space-y-4 p-8 text-xl overflow-y-scroll">
        <TitleBox title="Tips and tricks">
          <p>
            You can hold <b>ctrl</b> (<b>cmd</b> on mac) to show more detailed
            information or advanced functionality on almost any screen.
          </p>
          <CtrlDuo>
            <p>Try it out!</p>
            <p>Yaaaaay you did it! 👍</p>
          </CtrlDuo>
        </TitleBox>
        <TitleBox title="FreeDeck App">
          You can download it{" "}
          <Anchor
            newTab
            href="https://github.com/FreeYourStream/freedeck-configurator/releases"
          >
            here
          </Anchor>
        </TitleBox>
        <TitleBox title="FreeDeck Firmware">
          <ul className="list-disc list-inside">
            <li>
              <Anchor
                newTab
                href="https://github.com/FreeYourStream/freedeck-ino/archive/refs/heads/master.zip"
              >
                FreeDeck-micro
              </Anchor>
            </li>
            <li>
              <Anchor
                newTab
                href="https://github.com/FreeYourStream/freedeck-pico/releases"
              >
                FreeDeck-pico
              </Anchor>
            </li>
          </ul>
        </TitleBox>
        <TitleBox title="Old Configurator">
          You can find it{" "}
          <Anchor newTab href="https://fdold.freeyourstream.com">
            here
          </Anchor>
        </TitleBox>
      </div>
    </FDWindow>
  );
};
