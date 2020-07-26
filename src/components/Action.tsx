import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { EKeys, EMediaKeys, Keys, MediaKeys } from "../definitions/keys";
import { EAction } from "../lib/parse/parsePage";
import { scrollToPage } from "../lib/scrollToPage";
import { FDButton } from "./lib/button";
import {
  CheckButton,
  Column,
  Label,
  MicroButton,
  Row,
  SelectWrapper,
  Title,
  WrapRow,
} from "./lib/misc";
import { StyledSelect } from "./lib/misc";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  title: string;
  loadUserInteraction: boolean;
  hasSecondaryAction: boolean
}> = ({ setNewRow, pages, loadMode, loadKeys, loadPage, addPage, title, hasSecondaryAction=false }) => {
  const [mode, setMode] = useState<EAction>(loadMode);
  const [goTo, setGoTo] = useState<number>(loadPage);
  const [alt, setAlt] = useState<boolean>(loadKeys.includes(0xe2));
  const [ctrl, setCtrl] = useState<boolean>(loadKeys.includes(0xe0));
  const [shift, setShift] = useState<boolean>(loadKeys.includes(0xe1));
  const [superKey, setSuper] = useState<boolean>(loadKeys.includes(0xe3));
  const [keys, setKeys] = useState<number[]>(
    loadKeys?.filter(
      (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
    ) ?? []
  );

  const buildNewRow = useCallback(
    (
      row: Buffer,
      mode: EAction,
      modifiers: {
        ctrl: boolean;
        shift: boolean;
        alt: boolean;
        superKey: boolean;
      },
      keys: number[],
      goTo: number,
      hasSecondaryAction: boolean
    ) => {
      const secondaryOffset = hasSecondaryAction?16:0
      if (mode === EAction.changeLayout) {
        row.writeUInt8(1+secondaryOffset, 0);
        row.writeInt16LE(goTo, 1);
        return row;
      } else if (mode === EAction.keyboard) {
        let i = 1;
        row.writeUInt8(0+secondaryOffset, 0);
        if (modifiers.ctrl) row.writeUInt8(0xe0, i++);
        if (modifiers.shift) row.writeUInt8(0xe1, i++);
        if (modifiers.alt) row.writeUInt8(0xe2, i++);
        if (modifiers.superKey) row.writeUInt8(0xe3, i++);
        keys.forEach((key, index) => {
          row.writeUInt8(Math.max(0, Math.min(key, 255)), i + index);
        });
        return row;
      } else if (mode === EAction.special_keys) {
        row.writeUInt8(3+secondaryOffset, 0);
        row.writeInt16LE(keys[0], 1);
        return row;
      } else if (mode === EAction.noop) {
        row.writeUInt8(2+secondaryOffset, 0);
        return row;
      }
    },
    []
  );

  useEffect(() => {
    const row = new Buffer(8);
    buildNewRow(row, mode, { ctrl, shift, alt, superKey }, keys, goTo, hasSecondaryAction);
    setNewRow(row);
  }, [mode, goTo, keys, ctrl, shift, alt, superKey]);

  useEffect(() => {
    if (loadMode !== mode) {
      setMode(loadMode);
    }
  }, [loadMode]);

  useEffect(() => {
    if (loadKeys?.[loadKeys.length - 1]) {
      setKeys(
        loadKeys?.filter(
          (key) => key !== 0xe2 && key !== 0xe0 && key !== 0xe1 && key !== 0xe3
        ) ?? []
      );
    }
  }, [loadKeys]);

  useEffect(() => {
    setGoTo(loadPage);
  }, [loadPage]);

  return (
    <Wrapper>
      <Title>{title}</Title>
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
            <CheckButton width="24%" uff={ctrl} onClick={(e) => setCtrl(!ctrl)}>
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
              onChange={(e) => {if (keys.length < 7) setKeys([...keys, parseInt(e.target.value)])}}
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
    </Wrapper>
  );
};
