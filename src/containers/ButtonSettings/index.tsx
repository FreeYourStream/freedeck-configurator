import c from "clsx";
import React, { useContext } from "react";
import { EAction } from "../../definitions/modes";
import { Column, Row } from "../../lib/components/Misc";
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
    <div className={c()}>
      <Row>
        <Column>
          <Action
            primary={true}
            title="Short press"
            pageIndex={pageIndex}
            buttonIndex={displayIndex}
            pageCount={buttonSettingsPages.length}
            action={button.primary}
            loadUserInteraction={false}
          />
        </Column>
        <Column>
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
        </Column>
      </Row>{" "}
      <div className="mt-auto text-center">
        Disclaimer for Firefox and Safari:
      </div>
      <p className="text-center">
        If you have a non-US keyboard, the buttons recognized will not show the
        buttons on your keyboard. But it will still work like expected :) I
        would love to show the buttons as they are on your keyboard, but that is
        not so easy as i hoped. If you can help, please do it!
      </p>
    </div>
  );
};
