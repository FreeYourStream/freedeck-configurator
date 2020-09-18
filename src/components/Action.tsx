import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { IButtonSettings } from "../App";
import { colors } from "../definitions/colors";
import { EKeys, EMediaKeys, Keys, MediaKeys, keys } from "../definitions/keys";
import { FDButton } from "../lib/components/Button";
import {
  MicroButton,
  SelectWrapper,
  StyledSelect,
  Title,
  WrapRow,
} from "../lib/components/Misc";
import { EAction } from "../lib/configFile/parsePage";
import { scrollToPage } from "../lib/scrollToPage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
`;

const SmallButton = styled(FDButton).attrs({ mt: 4 })`
  font-weight: bold;
`;

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
      setActionSetting({
        ...action,
        mode,
        enabled: mode !== EAction.noop,
        values: [],
      });
    },
    [action, setActionSetting]
  );
  const setKeys = useCallback(
    (keys: number[]) => {
      setActionSetting({ ...action, values: keys });
    },
    [action, setActionSetting]
  );
  const setGoTo = useCallback(
    (goTo: number) => {
      setActionSetting({ ...action, values: [goTo] });
    },
    [action, setActionSetting]
  );
  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, type: "js" | "uni") => {
      const key = Object.keys(keys).find(
        (key) => keys[key]?.[type] === e.which
      );
      if (!key) return;
      if (keys[key]!.hid === 42 && action.values.length > 0) {
        setKeys([...action.values.slice(0, action.values.length - 1)]);
      } else if (action.values.length < 7)
        setKeys([...action.values, keys[key]!.hid]);
    },
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
          <option value="0">Send Keys</option>
          <option value="3">Special Keys</option>
        </StyledSelect>
      </SelectWrapper>
      {action.mode === 0 && (
        <>
          <SelectWrapper>
            <StyledSelect
              value={0}
              onChange={(e) => {
                if (action.values.length < 7)
                  setKeys([...action.values, parseInt(e.target.value)]);
              }}
            >
              <option key={0} value={0}>
                Nothing
              </option>
              {Object.keys(keys).map((keyName) => (
                <option key={keyName} value={keys[keyName]?.hid}>
                  {keyName}
                </option>
              ))}
            </StyledSelect>
          </SelectWrapper>
          <KeyScanner
            tabIndex={0}
            onKeyPress={(e) => onKey(e, "uni")}
            onKeyDown={(e) => onKey(e, "js")}
          >
            Click to recognize
          </KeyScanner>
          <WrapRow>
            {action.values.map((key, index) => (
              <MicroButton
                mt={8}
                key={`${key}-${index}`}
                onClick={() => {
                  const newKeys = [...action.values];
                  newKeys.splice(index, 1);
                  setKeys(newKeys.slice(0, 7));
                }}
              >
                {EKeys[key].toString()}
              </MicroButton>
            ))}
          </WrapRow>
        </>
      )}
      {action.mode === 1 && (
        <>
          {pages.length ? (
            <SelectWrapper>
              <StyledSelect
                value={action.values[0]}
                onChange={(e) => setGoTo(parseInt(e.target.value))}
              >
                <option value={-1}>Select Page</option>
                {pages.map((pageNumber) => (
                  <option key={pageNumber} value={pageNumber}>
                    Go to {pageNumber}
                  </option>
                ))}
              </StyledSelect>
            </SelectWrapper>
          ) : null}
          {!action.values?.length || action.values[0] === -1 ? (
            <FDButton mt={8} size={1} onClick={async () => await addPage()}>
              Add Page +
            </FDButton>
          ) : (
            <FDButton
              mt={8}
              size={1}
              onClick={() => scrollToPage(action.values[0])}
            >
              Scroll To {action.values[0].toString()}
            </FDButton>
          )}
        </>
      )}
      {action.mode === 3 && (
        <>
          <SelectWrapper>
            <StyledSelect
              value={action.values[0]}
              onChange={(e) => setKeys([parseInt(e.target.value)])}
            >
              <option key={0} value={0}>
                Nothing
              </option>
              {MediaKeys.map((enumKey) => (
                //@ts-ignore
                <option key={enumKey} value={EMediaKeys[enumKey]}>
                  {enumKey}
                </option>
              ))}
            </StyledSelect>
          </SelectWrapper>
        </>
      )}
    </Wrapper>
  );
};
