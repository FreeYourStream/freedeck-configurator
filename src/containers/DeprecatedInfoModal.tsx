import React from "react";
import { useNavigate } from "react-router";
import { Anchor } from "../lib/components/Anchor";

import { FDWindow } from "../lib/components/Window";

export const DeprecatedInfoModal: React.FC<{}> = () => {
  const nav = useNavigate();

  return (
    <FDWindow
      className="w-auto h-auto"
      visible={true}
      setClose={() => {
        nav("/");
        localStorage.setItem("dontShowDeprecatedInfo", "true");
      }}
      title="Deprecation Info"
    >
      <div className="flex flex-col items-center space-y-4 p-8 text-xl">
        <div className="text-danger-500 text-4xl pb-4">Attention!</div>
        <div>This is the new configurator.</div>
        <div>Your old config is not supported anymore. </div>
        <div>Please create a new one with this new configurator.</div>
        <div>You can find the old configurator here:</div>
        <Anchor newTab href="https://fdold.freeyourstream.com" className="text-primary-500">
          fdold.freeyourstream.com
        </Anchor>
        <div>It won't receive further updates</div>
      </div>
    </FDWindow>
  );
};
