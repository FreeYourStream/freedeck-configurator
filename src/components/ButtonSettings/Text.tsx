import React from "react";
import styled from "styled-components";

import { IButtonSettings } from "../../interfaces";
import { colors } from "../../definitions/colors";
import { keys } from "../../definitions/keys";
import {
  SelectWrapper,
  StyledSelect,
  WrapRow,
} from "../../lib/components/Misc";
import { useTranslateKeyboardLayout } from "../../lib/localisation/keyboard";

const TextBox = styled.textarea`
  font-family: "Barlow";
  font-size: 16px;
  color: ${colors.white};
  background-color: ${colors.black};
  width: 100%;
  user-select: none;
  margin-top: 16px;
  border: none;
  resize: none;
  :focus {
    outline: none;
  }
`;
export const Text: React.FC<{
  action: IButtonSettings;
  setKeys: (keys: number[]) => void;
  onKey: (e: React.KeyboardEvent<any>, lengthLimit?: any) => void;
}> = ({ action, setKeys, onKey }) => {
  const translatedKeys = useTranslateKeyboardLayout(action.values);
  return (
    <>
      <SelectWrapper>
        <StyledSelect
          value={0}
          onChange={(e) => {
            if (action.values.length < 15)
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
      </SelectWrapper>
      <WrapRow>
        <TextBox
          rows={12}
          onKeyDown={(e) => {
            if (e.nativeEvent.code !== "Backspace") return onKey(e, 15);
            const newKeys = [...action.values];
            newKeys.splice(newKeys.length - 1, 1);
            setKeys(newKeys);
          }}
          value={translatedKeys.reduce((acc, value) => `${acc}[${value}]`, "")}
        />
      </WrapRow>
    </>
  );
};
