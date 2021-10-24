import React, { useCallback, useContext } from "react";
import { keys } from "../../definitions/keys";
import { EAction } from "../../definitions/modes";
import { IButtonSetting } from "../../interfaces";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { Title } from "../../lib/components/Title";
import { ConfigDispatchContext } from "../../states/configState";
import { ChangePage } from "./ChangePage";
import { FreeDeckSettings } from "./FreeDeckSettings";
import { Hotkeys } from "./Hotkeys";
import { SpecialKeys } from "./SpecialKeys";
import { Text } from "./Text";

export const Action: React.FC<{
  pageIndex: number;
  buttonIndex: number;
  pageCount: number;
  action: IButtonSetting;
  loadUserInteraction: boolean;
  title: string;
  primary: boolean;
}> = ({ action, title, pageIndex, buttonIndex, pageCount, primary }) => {
  const configDispatch = useContext(ConfigDispatchContext);
  const pages = [...Array(pageCount).keys()].filter(
    (pageNumber) => pageNumber !== pageIndex
  );
  const priOrSec = primary ? "primary" : "secondary";
  const setMode = (mode: EAction) => {
    const keepValues =
      [EAction.hotkeys, EAction.text].includes(action.mode) &&
      [EAction.hotkeys, EAction.text].includes(mode);
    configDispatch.setButtonSettings({
      pageIndex,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        mode,
        enabled: mode !== EAction.noop,
        values: keepValues ? action.values : [],
      },
    });
  };
  const setMultipleValues = (keys: number[]) =>
    configDispatch.setButtonSettings({
      pageIndex,
      buttonIndex,
      priOrSec,
      buttonSettings: {
        ...action,
        values: keys[0] === -1 ? [] : keys,
      },
    });

  const setSingleValue = (goTo: number) =>
    configDispatch.setButtonSettings({
      pageIndex,
      buttonIndex,
      priOrSec,
      buttonSettings: { ...action, values: goTo === -1 ? [] : [goTo] },
    });
  const onKey = useCallback(
    (e: React.KeyboardEvent<any>, lengthLimit = 7) => {
      if (e.repeat) return;
      const key = Object.keys(keys).find(
        (key) => keys[key]?.js === e.nativeEvent.code
      );
      if (!key) return;
      //ignore backspace
      if (keys[key]!.hid === 42 && action.values.length > 0) {
        setMultipleValues([
          ...action.values.slice(0, action.values.length - 1),
        ]);
      } else if (action.values.length < lengthLimit)
        setMultipleValues([...action.values, keys[key]!.hid]);
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
        <Hotkeys action={action} onKey={onKey} setKeys={setMultipleValues} />
      )}
      {action.mode === EAction.changePage && (
        <ChangePage
          action={action}
          addPage={() => {
            configDispatch.addPage({
              previousPage: pageIndex,
              previousDisplay: buttonIndex,
            });
          }}
          pages={pages}
          setGoTo={setSingleValue}
        />
      )}
      {action.mode === EAction.special_keys && (
        <SpecialKeys action={action} setKeys={setMultipleValues} />
      )}
      {action.mode === EAction.text && (
        <Text action={action} onKey={onKey} setKeys={setMultipleValues} />
      )}
      {action.mode === EAction.settings && (
        <FreeDeckSettings action={action} setSetting={setMultipleValues} />
      )}
    </div>
  );
};
