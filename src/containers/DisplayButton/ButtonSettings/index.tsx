import React, { useContext } from "react";

import { ConfigStateContext } from "../../../states/configState";
import { Action } from "./Action";

export const ButtonSettingsContainer: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const { pages } = useContext(ConfigStateContext);
  const button = pages.byId[pageId].displayButtons[displayIndex].button;
  return (
    <div className="flex flex-col h-full w-full p-8">
      <div className="grid grid-cols-2 grid-rows-1 gap-2 h-full mb-4">
        <div className="relative flex flex-col">
          <Action
            primary={true}
            title="Short press"
            pageId={pageId}
            buttonIndex={displayIndex}
            buttonSettings={button.primary}
          />
        </div>
        <div className="relative flex flex-col">
          <Action
            primary={false}
            title="Long press"
            pageId={pageId}
            buttonIndex={displayIndex}
            buttonSettings={button.secondary}
          />
        </div>
      </div>
      {(button.primary.mode === "hotkeys" ||
        button.secondary.mode === "hotkeys") && (
        <div className="mt-auto text-center">
          <div>Disclaimer for Firefox and Safari:</div>
          <p>
            If you have a non-US keyboard, the buttons recognized will not show
            the buttons on your keyboard. But it will still work like expected
            :) I would love to show the buttons as they are on your keyboard,
            but that is not so easy as i hoped. If you can help, please feel
            free to contribute!
          </p>
        </div>
      )}
    </div>
  );
};
