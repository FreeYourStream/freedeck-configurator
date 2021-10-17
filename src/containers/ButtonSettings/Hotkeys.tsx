import React from "react";
import styled from "styled-components";
import { colors } from "../../definitions/colors";
import { keys } from "../../definitions/keys";
import { IButtonSetting } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { StyledSelect } from "../../lib/components/SelectInput";
import { useTranslateKeyboardLayout } from "../../lib/localisation/keyboard";

const KeyScanner = styled.div`
  font-family: Barlow, sans-serif;
  margin-top: 8px;
  height: 24px;
  background-color: ${colors.white};
  color: ${colors.black};
  border-radius: 3px;
  display: flex;
  justify-content: center;
`;

const HotkeyKeys: React.FC<{
  values: number[];
  setKeys: (keys: number[]) => void;
}> = ({ values, setKeys }) => {
  const translatedKeys = useTranslateKeyboardLayout(values);
  return (
    <>
      {translatedKeys.map((key, index) => (
        <FDButton
          size={1}
          key={`${key}-${index}`}
          onClick={() => {
            const newKeys = [...values];
            newKeys.splice(index, 1);
            setKeys(newKeys.slice(0, 7));
          }}
        >
          {key}
        </FDButton>
      ))}
    </>
  );
};

export const Hotkeys: React.FC<{
  action: IButtonSetting;
  setKeys: (keys: number[]) => void;
  onKey: (e: React.KeyboardEvent<any>, lengthLimit?: any) => void;
}> = ({ action, setKeys, onKey }) => {
  return (
    <>
      <StyledSelect
        value={0}
        onChange={(e) => {
          if (action.values.length < 7)
            setKeys([...action.values, parseInt(e.target.value)]);
        }}
      >
        <option key={0} value={0}>
          Choose Key
        </option>
        {Object.keys(keys).map((keyName) => (
          <option key={keyName} value={keys[keyName]?.hid}>
            {keyName}
          </option>
        ))}
      </StyledSelect>
      <KeyScanner tabIndex={0} onKeyDown={(e) => onKey(e)}>
        Click to recognize
      </KeyScanner>
      <div>
        {" "}
        {/* wraprow */}
        <HotkeyKeys setKeys={setKeys} values={action.values} />
      </div>
    </>
  );
};
