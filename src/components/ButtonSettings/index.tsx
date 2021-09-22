import React, { useCallback } from "react";
import styled from "styled-components";

import { IButtonSettings } from "../../interfaces";
import { keys } from "../../definitions/keys";
import { EAction } from "../../definitions/modes";
import { SelectWrapper, StyledSelect, Title } from "../../lib/components/Misc";
import { ChangePage } from "./ChangePage";
import { FreeDeckSettings } from "./FreeDeckSettings";
import { Hotkeys } from "./Hotkeys";
import { SpecialKeys } from "./SpecialKeys";
import { Text } from "./Text";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
`;

export const Action: React.FC<{
  setActionSetting: (newActionSetting: IButtonSettings) => void;
  addPage: () => Promise<number>;
  pages: number[];
  action: IButtonSettings;
  loadUserInteraction: boolean;
  title: string;
}> = ({ setActionSetting, pages, addPage, action, title }) => {
  const setMode = useCallback(
    (mode: EAction) => {
      const keepValues =
        [EAction.hotkeys, EAction.text].includes(action.mode) &&
        [EAction.hotkeys, EAction.text].includes(mode);
      setActionSetting({
        ...action,
        mode,
        enabled: mode !== EAction.noop,
        values: keepValues ? action.values : [],
      });
    },
    [action, setActionSetting]
  );
  const setMultipleValues = useCallback(
    (keys: number[]) => {
      setActionSetting({ ...action, values: keys[0] === -1 ? [] : keys });
    },
    [action, setActionSetting]
  );
  const setSingleValue = useCallback(
    (goTo: number) => {
      setActionSetting({ ...action, values: goTo === -1 ? [] : [goTo] });
    },
    [action, setActionSetting]
  );
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
    <Wrapper>
      <Title>{title}</Title>
      <SelectWrapper>
        <StyledSelect
          value={action.mode}
          onChange={(e) => setMode(parseInt(e.target.value))}
        >
          <option value="2">Do nothing</option>
          <option value="1">Change Page</option>
          <option value="0">Hot Key</option>
          <option value="3">Special Keys</option>
          <option value="4">Text (Beta)</option>
          <option value="5">Settings (Beta)</option>
        </StyledSelect>
      </SelectWrapper>
      {action.mode === EAction.hotkeys && (
        <Hotkeys action={action} onKey={onKey} setKeys={setMultipleValues} />
      )}
      {action.mode === EAction.changePage && (
        <ChangePage
          action={action}
          addPage={addPage}
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
    </Wrapper>
  );
};
