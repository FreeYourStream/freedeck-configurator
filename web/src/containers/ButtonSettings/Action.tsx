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
  action: IButtonSetting;
  loadUserInteraction: boolean;
  title: string;
  primary: boolean;
}> = ({ action, title, pageId, buttonIndex, primary }) => {
  const configDispatch = useContext(ConfigDispatchContext);
  const configState = useContext(ConfigStateContext);
  const priOrSec = primary ? "primary" : "secondary";
  const setMode = (mode: EAction) => {
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        mode,
        enabled: mode !== EAction.noop,
      },
    });
  };
  const setValues = (values: number[], mode: EAction) =>
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        values: {
          ...action.values,
          [mode]: values[0] === -1 ? [] : values,
        },
      },
    });

  const setGoToValue = (goTo: string) =>
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        values: { ...action.values, changePage: goTo },
      },
    });
  const setFDSettings = (setting: FDSettings, value?: number) =>
    configDispatch.setButtonSettings({
      pageId,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        values: {
          ...action.values,
          settings: {
            setting,
            value: value ?? 0,
          },
        },
      },
    });
  const onKey = useCallback(
    (e: React.KeyboardEvent<any>, lengthLimit = 7) => {
      if (e.repeat) return;
      const key = Object.keys(keys).find(
        (key) => keys[key]?.js === e.nativeEvent.code
      );
      if (!key) return;
      //ignore backspace
      if (keys[key]!.hid === 42 && action.values.hotkeys.length > 0) {
        setValues(
          [...action.values.hotkeys.slice(0, action.values.hotkeys.length - 1)],
          EAction.hotkeys
        );
      } else if (action.values.hotkeys.length < lengthLimit)
        setValues([...action.values.hotkeys, keys[key]!.hid], EAction.hotkeys);
    }, // eslint-disable-next-line
    [action]
  );
  return (
    <div className="flex flex-col h-full">
      <Title className="mb-2">{title}</Title>
      <Row>
        <Label>Mode</Label>
        <StyledSelect
          className="w-40"
          value={action.mode}
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
      {action.mode === EAction.hotkeys && (
        <Hotkeys
          action={action}
          onKey={onKey}
          setKeys={(values) => setValues(values, EAction.hotkeys)}
        />
      )}
      {action.mode === EAction.changePage && (
        <ChangePage
          action={action}
          addPage={() => {
            configDispatch.addPage({
              previousPage: pageId,
              previousDisplay: buttonIndex,
            });
          }}
          pages={configState.pages}
          setGoTo={setGoToValue}
        />
      )}
      {action.mode === EAction.special_keys && (
        <SpecialKeys
          action={action}
          setKeys={(values) => setValues(values, EAction.special_keys)}
        />
      )}
      {action.mode === EAction.text && (
        <Text
          action={action}
          onKey={onKey}
          setKeys={(values) => setValues(values, EAction.text)}
        />
      )}
      {action.mode === EAction.settings && (
        <FreeDeckSettings
          action={action}
          setSetting={(setting, value) => setFDSettings(setting, value)}
        />
      )}
    </div>
  );
};
