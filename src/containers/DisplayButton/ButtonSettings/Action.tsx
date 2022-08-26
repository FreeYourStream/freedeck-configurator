import React, { useContext } from "react";

import { EAction } from "../../../definitions/modes";
import { ButtonSetting } from "../../../generated";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { TitleBox } from "../../../lib/components/Title";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";
import { ChangePage } from "./ChangePage";
import { FreeDeckSettings } from "./FreeDeckSettings";
import { Hotkeys } from "./Hotkeys";
import { LeavePage } from "./LeavePage";
import { SpecialKeys } from "./SpecialKeys";
import { Text } from "./Text";

export const Action: React.FC<{
  pageId: string;
  buttonIndex: number;
  buttonSettings: ButtonSetting;
  title: string;
  primary: boolean;
}> = ({ buttonSettings, title, pageId, buttonIndex, primary }) => {
  const configDispatch = useContext(ConfigDispatchContext);
  const configState = useContext(ConfigStateContext);
  const priOrSec = primary ? "primary" : "secondary";

  const setMode = (mode: EAction) => {
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...buttonSettings,
        mode,
      },
    });
  };

  const setValues = (values: ButtonSetting["values"]) =>
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...buttonSettings,
        values: {
          ...values,
        },
      },
    });

  return (
    <div className="flex flex-col h-full">
      <TitleBox title={title} className="mb-2 h-full">
        <>
          <Row>
            <Label>Mode</Label>
            <FDSelect
              className="w-48"
              value={buttonSettings.mode}
              onChange={(value) => setMode(value)}
              options={[
                { value: EAction.noop, text: "Do nothing" },
                { value: EAction.changePage, text: "Change Page" },
                { value: EAction.hotkeys, text: "Hot Key" },
                { value: EAction.special_keys, text: "Special Keys" },
                { value: EAction.text, text: "Text (App only)" },
                { value: EAction.settings, text: "Settings" },
              ]}
            />
          </Row>
          {buttonSettings.mode === EAction.hotkeys && (
            <Hotkeys
              values={buttonSettings.values}
              setValues={(values) => setValues(values)}
            />
          )}
          {buttonSettings.mode === EAction.changePage && (
            <ChangePage
              values={buttonSettings.values}
              previousPage={pageId}
              pages={configState.pages}
              previousDisplay={buttonIndex}
              setValues={(values) => setValues(values)}
              secondary={!primary}
            />
          )}
          {buttonSettings.mode === EAction.special_keys && (
            <SpecialKeys
              values={buttonSettings.values}
              setValues={(values) => setValues(values)}
            />
          )}
          {buttonSettings.mode === EAction.text && (
            <Text
              values={buttonSettings.values}
              setValues={(values) => setValues(values)}
            />
          )}
          {buttonSettings.mode === EAction.settings && (
            <FreeDeckSettings
              values={buttonSettings.values}
              setValues={(values) => setValues(values)}
            />
          )}
          {buttonSettings.mode !== EAction.changePage && (
            <LeavePage
              primary={primary}
              value={
                configState.pages.byId[pageId].displayButtons[buttonIndex]
                  .button[primary ? "primary" : "secondary"].leavePage
              }
              pages={configState.pages}
              setValue={(value) =>
                configDispatch.setLeavePage({
                  buttonIndex,
                  pageId,
                  targetPageId: value.pageId,
                  enabled: value.enabled,
                  primary: primary,
                })
              }
            />
          )}
        </>
      </TitleBox>
    </div>
  );
};
