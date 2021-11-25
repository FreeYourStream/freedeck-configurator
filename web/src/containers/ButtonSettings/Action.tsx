import React, { useCallback, useContext } from "react";

import { keys } from "../../definitions/keys";
import { EAction } from "../../definitions/modes";
import { FDSettings, IButtonSetting, IPage } from "../../interfaces";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { Title } from "../../lib/components/Title";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { ChangePage } from "./ChangePage";
import { FreeDeckSettings } from "./FreeDeckSettings";
import { Hotkeys } from "./Hotkeys";
import { SpecialKeys } from "./SpecialKeys";
import { Text } from "./Text";

export const Action: React.FC<{
  pageId: string;
  buttonIndex: number;
  buttonSettings: IButtonSetting;
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
        enabled: mode !== EAction.noop,
      },
    });
  };

  const setValues = (values: IButtonSetting["values"]) =>
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
      <Title className="mb-2">{title}</Title>
      <Row>
        <Label>Mode</Label>
        <StyledSelect
          className="w-40"
          value={buttonSettings.mode}
          onChange={(value) => setMode(parseInt(value))}
          options={[
            { value: 2, text: "Do nothing" },
            { value: 1, text: "Change Page" },
            { value: 0, text: "Hot Key" },
            { value: 3, text: "Special Keys" },
            { value: 4, text: "Text (Beta)" },
            { value: 5, text: "Settings (Beta)" },
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
    </div>
  );
};
