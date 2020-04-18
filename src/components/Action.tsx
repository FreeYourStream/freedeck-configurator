import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { EKeys, Keys, MediaKeys, EMediaKeys } from "../definitions/keys";
import { EAction } from "../lib/parse/parsePage";
import { scrollToPage } from "../lib/scrollToPage";
import { FDButton } from "./lib/button";
import {
  Column,
  Label,
  MicroButton,
  SelectWrapper,
  Row,
  WrapRow,
  CheckButton,
  Title,
} from "./lib/misc";
import { StyledSelect } from "./lib/misc";

const Wrapper = styled.div`
  display: flex;
  min-height: 100px;
`;

const SmallButton = styled(FDButton).attrs({ mt: 4 })`
  font-weight: bold;
`;
export const Action: React.FC<{
  setNewRow: (newRow: Buffer) => void;
  addPage: () => number;
  pages: number[];
  loadMode: EAction;
  loadKeys: number[];
  loadPage: number;
  loadModeSecondary: EAction;
  loadKeysSecondary: number[];
  loadPageSecondary: number;
}> = ({
  setNewRow,
  pages,
  loadMode,
  loadKeys,
  loadPage,
  addPage,
  loadModeSecondary,
  loadKeysSecondary,
  loadPageSecondary,
}) => {
  const [mode, setMode] = useState<EAction>(loadMode);
  const [goTo, setGoTo] = useState<number>(loadPage);
  const [alt, setAlt] = useState<boolean>(loadKeys.includes(0xe2));
  const [ctrl, setCtrl] = useState<boolean>(loadKeys.includes(0xe0));
  const [shift, setShift] = useState<boolean>(loadKeys.includes(0xe1));
  const [superKey, setSuper] = useState<boolean>(loadKeys.includes(0xe3));
  const [keys, setKeys] = useState<number[]>(
    loadKeys?.filter(
      (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
    ) ?? [0]
  );

  const [modeSecondary, setModeSecondary] = useState<EAction>(
    loadModeSecondary
  );
  const [goToSecondary, setGoToSecondary] = useState<number>(loadPageSecondary);
  const [altSecondary, setAltSecondary] = useState<boolean>(
    loadKeysSecondary?.includes(0xe2)
  );
  const [ctrlSecondary, setCtrlSecondary] = useState<boolean>(
    loadKeysSecondary?.includes(0xe0)
  );
  const [shiftSecondary, setShiftSecondary] = useState<boolean>(
    loadKeysSecondary?.includes(0xe1)
  );
  const [superKeySecondary, setSuperSecondary] = useState<boolean>(
    loadKeysSecondary?.includes(0xe3)
  );
  const [keysSecondary, setKeysSecondary] = useState<number[]>(
    loadKeysSecondary?.filter(
      (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
    ) ?? [0]
  );
  const buildNewRow = useCallback(
    (
      row: Buffer,
      mode: EAction,
      secondaryPresent: boolean,
      modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        superKey: boolean;
      },
      keys: number[],
      goTo: number
    ) => {
      const secondaryOffset = secondaryPresent ? 16 : 0;
      if (mode === EAction.changeLayout) {
        row.writeUInt8(1 + secondaryOffset, 0);
        row.writeInt16LE(goTo, 1);
        return row;
      } else if (mode === EAction.keyboard) {
        let i = 1;
        row.writeUInt8(0 + secondaryOffset, 0);
        if (modifiers.ctrl) row.writeUInt8(0xe0, i++);
        if (modifiers.shift) row.writeUInt8(0xe1, i++);
        if (modifiers.alt) row.writeUInt8(0xe2, i++);
        if (modifiers.superKey) row.writeUInt8(0xe3, i++);
        keys.forEach((key, index) => {
          row.writeUInt8(Math.max(0, Math.min(key, 255)), i + index);
        });
        return row;
      } else if (mode === EAction.special_keys) {
        row.writeUInt8(3 + secondaryOffset, 0);
        row.writeInt16LE(keys[0], 1);
        return row;
      } else if (mode === EAction.noop) {
        row.writeUInt8(2, 0);
        return row;
      }
    },
    []
  );

  useEffect(() => {
    if (loadMode !== mode) {
      setMode(loadMode);
    }
  }, [loadMode]);

  useEffect(() => {
    if (loadModeSecondary !== modeSecondary) {
      setModeSecondary(loadModeSecondary);
    }
  }, [loadModeSecondary]);

  useEffect(() => {
    if (loadKeys?.[loadKeys.length - 1]) {
      setKeys(
        loadKeys?.filter(
          (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
        ) ?? [0]
      );
    }
  }, [loadKeys]);
  useEffect(() => {
    if (loadKeysSecondary?.[loadKeysSecondary.length - 1]) {
      setKeysSecondary(
        loadKeysSecondary?.filter(
          (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
        ) ?? [0]
      );
    }
  }, [loadKeysSecondary]);

  useEffect(() => {
    setGoTo(loadPage);
  }, [loadPage]);

  useEffect(() => {
    setGoToSecondary(loadPageSecondary);
  }, [loadPageSecondary]);

  useEffect(() => {
    const row = new Buffer(16);
    buildNewRow(
      row,
      mode,
      modeSecondary != EAction.noop,
      { ctrl, shift, alt, superKey },
      keys,
      goTo
    );
    console.log(row);
    buildNewRow(
      row.slice(8),
      modeSecondary,
      false,
      {
        ctrl: ctrlSecondary,
        shift: shiftSecondary,
        alt: altSecondary,
        superKey: superKeySecondary,
      },
      keysSecondary,
      goToSecondary
    );
    setNewRow(row);
  }, [
    mode,
    modeSecondary,
    goTo,
    goToSecondary,
    keys,
    keysSecondary,
    ctrl,
    ctrlSecondary,
    shift,
    shiftSecondary,
    alt,
    altSecondary,
    superKey,
    superKeySecondary,
  ]);

  return (
    <Wrapper>
      <Column>
        <Title>Short Press</Title>
        <SelectWrapper>
          <StyledSelect
            value={mode}
            onChange={(e) => setMode(parseInt(e.target.value))}
          >
            <option value="0">Send Keys</option>
            <option value="3">Special Keys</option>
            <option value="1">Change Page</option>
            <option value="2">Do nothing</option>
          </StyledSelect>
        </SelectWrapper>
        {mode === 0 && (
          <>
            <Row>
              <CheckButton
                width="24%"
                uff={ctrl}
                onClick={(e) => setCtrl(!ctrl)}
              >
                Ctrl
              </CheckButton>
              <CheckButton
                width="24%"
                uff={shift}
                onClick={(e) => setShift(!shift)}
              >
                Shift
              </CheckButton>
              <CheckButton width="24%" uff={alt} onClick={(e) => setAlt(!alt)}>
                Alt
              </CheckButton>
              <CheckButton
                width="24%"
                uff={superKey}
                onClick={(e) => setSuper(!superKey)}
              >
                Win
              </CheckButton>
            </Row>
            <WrapRow>
              {keys.map((key, index) => (
                <MicroButton
                  onClick={() => {
                    const newKeys = [...keys];
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
                onChange={(e) => setKeys([...keys, parseInt(e.target.value)])}
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
        {mode === 1 && (
          <>
            {pages.length ? (
              <SelectWrapper>
                <StyledSelect
                  value={goTo}
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
            {goTo === -1 ? (
              <SmallButton size={1} onClick={() => setGoTo(addPage())}>
                Add Page +
              </SmallButton>
            ) : (
              <SmallButton size={1} onClick={() => scrollToPage(goTo)}>
                Scroll To {goTo}
              </SmallButton>
            )}
          </>
        )}
        {mode === 3 && (
          <>
            <SelectWrapper>
              <StyledSelect
                value={keys[0]}
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
      </Column>
      <Column>
        <Title>Long Press</Title>
        <SelectWrapper>
          <StyledSelect
            value={modeSecondary}
            onChange={(e) => setModeSecondary(parseInt(e.target.value))}
          >
            <option value="0">Send Keys</option>
            <option value="3">Special Keys</option>
            <option value="1">Change Page</option>
            <option value="2">Do nothing</option>
          </StyledSelect>
        </SelectWrapper>
        {modeSecondary === 0 && (
          <>
            <Row>
              <CheckButton
                width="24%"
                uff={ctrlSecondary}
                onClick={(e) => setCtrlSecondary(!ctrlSecondary)}
              >
                Ctrl
              </CheckButton>
              <CheckButton
                width="24%"
                uff={shiftSecondary}
                onClick={(e) => setShiftSecondary(!shiftSecondary)}
              >
                Shift
              </CheckButton>
              <CheckButton
                width="24%"
                uff={altSecondary}
                onClick={(e) => setAltSecondary(!altSecondary)}
              >
                Alt
              </CheckButton>
              <CheckButton
                width="24%"
                uff={superKeySecondary}
                onClick={(e) => setSuperSecondary(!superKeySecondary)}
              >
                Win
              </CheckButton>
            </Row>
            <WrapRow>
              {keysSecondary.map((key, index) => (
                <MicroButton
                  onClick={() => {
                    const newKeys = [...keysSecondary];
                    newKeys.splice(index, 1);
                    setKeysSecondary(newKeys.slice(0, 7));
                  }}
                >
                  {EKeys[key].toString()}
                </MicroButton>
              ))}
            </WrapRow>
            <SelectWrapper>
              <StyledSelect
                value={0}
                onChange={(e) =>
                  setKeysSecondary([...keysSecondary, parseInt(e.target.value)])
                }
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
        {modeSecondary === 1 && (
          <>
            {pages.length ? (
              <SelectWrapper>
                <StyledSelect
                  value={goToSecondary}
                  onChange={(e) => setGoToSecondary(parseInt(e.target.value))}
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
            {goToSecondary === -1 || goToSecondary === undefined ? (
              <SmallButton size={1} onClick={() => setGoToSecondary(addPage())}>
                Add Page +
              </SmallButton>
            ) : (
              <SmallButton size={1} onClick={() => scrollToPage(goToSecondary)}>
                Scroll To {goToSecondary}
              </SmallButton>
            )}
          </>
        )}
        {modeSecondary === 3 && (
          <>
            <SelectWrapper>
              <StyledSelect
                value={keysSecondary[0]}
                onChange={(e) => setKeysSecondary([parseInt(e.target.value)])}
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
      </Column>
    </Wrapper>
  );
};
