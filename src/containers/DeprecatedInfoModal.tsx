import React from "react";
import { useNavigate } from "react-router";

import { FDWindow } from "../lib/components/Window";

export const DeprecatedInfoModal: React.FC<{}> = () => {
  const nav = useNavigate();

  return (
    <FDWindow
      className="w-auto h-auto"
      visible={true}
      setClose={() => {
        nav("/");
        localStorage.setItem("dontShow128Info", "true");
      }}
      title="Deprecation Info"
    >
      <div className="flex flex-col items-center space-y-4 p-8 text-xl">
        <div className="text-danger-500 text-4xl pb-4">Attention!</div>
        <div>The config format changed slightly.</div>
        <div>You need to update the firmware of your FreeDeck. </div>
        <div>Then just save the config once again and everything is fine.</div>
        <div>The update allows for storing 60 keys instead of 7.</div>
      </div>
    </FDWindow>
  );
};
