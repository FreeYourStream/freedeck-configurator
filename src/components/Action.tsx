import React, { useCallback } from "react";
import styled from "styled-components";

import { IButtonSettings } from "../App";
import { EKeys, EMediaKeys, Keys, MediaKeys } from "../definitions/keys";
import { FDButton } from "../lib/components/button";
import {
  MicroButton,
  SelectWrapper,
  StyledSelect,
  Title,
  WrapRow,
} from "../lib/components/misc";
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
  return (
    <Wrapper>
      <Title>{title}</Title>
      <SelectWrapper>
        <StyledSelect
          value={action.mode}
          onChange={(e) => setMode(parseInt(e.target.value))}
        >
          <option value="0">Send Keys</option>
          <option value="3">Special Keys</option>
          <option value="1">Change Page</option>
          <option value="2">Do nothing</option>
        </StyledSelect>
      </SelectWrapper>
      {action.mode === 0 && (
        <>
          <WrapRow>
            {action.values.map((key, index) => (
              <MicroButton
                key={key}
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
              {Keys.map((enumKey) => (
                //@ts-ignore
                <option key={enumKey} value={EKeys[enumKey]}>
                  {enumKey}
                </option>
              ))}
            </StyledSelect>
          </SelectWrapper>
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
          {!action.values?.length ? (
            <SmallButton size={1} onClick={async () => await addPage()}>
              Add Page +
            </SmallButton>
          ) : (
            <SmallButton
              size={1}
              onClick={() => scrollToPage(action.values[0])}
            >
              Scroll To {action.values[0].toString()}
            </SmallButton>
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
