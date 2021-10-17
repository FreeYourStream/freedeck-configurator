import React, { useContext } from "react";
import { EAction } from "../../definitions/modes";
import { ConfigStateContext } from "../../states/configState";
import { Action } from "./Action";

export const ButtonSettingsContainer: React.FC<{
  pageIndex: number;
  displayIndex: number;
}> = ({ pageIndex, displayIndex }) => {
  const { buttonSettingsPages } = useContext(ConfigStateContext);
  console.log(pageIndex, displayIndex);
  const button = buttonSettingsPages[pageIndex][displayIndex];
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 grid-rows-1 gap-4 h-full mb-4">
        <div className="relative flex flex-col p-4 bg-gray-700 rounded-2xl">
          <Action
            primary={true}
            title="Short press"
            pageIndex={pageIndex}
            buttonIndex={displayIndex}
            pageCount={buttonSettingsPages.length}
            action={button.primary}
            loadUserInteraction={false}
          />
        </div>
        <div className="relative flex flex-col p-4 bg-gray-700 rounded-2xl">
          {button.primary.mode !== EAction.text && (
            <Action
              primary={false}
              title="Long press"
              pageIndex={pageIndex}
              buttonIndex={displayIndex}
              pageCount={buttonSettingsPages.length}
              action={button.secondary}
              loadUserInteraction={false}
            />
          )}
        </div>
      </div>
      <div className="mt-auto text-center">
        <div>Disclaimer for Firefox and Safari:</div>
        <p>
          If you have a non-US keyboard, the buttons recognized will not show
          the buttons on your keyboard. But it will still work like expected :)
          I would love to show the buttons as they are on your keyboard, but
          that is not so easy as i hoped. If you can help, please feel free to
          contribute!
        </p>
      </div>
    </div>
  );
};
