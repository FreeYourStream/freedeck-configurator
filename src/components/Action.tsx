import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { EKeys, Keys, MediaKeys, EMediaKeys } from "../definitions/keys";
import { EAction } from "../lib/parse/parsePage";
import { scrollToPage } from "../lib/scrollToPage";
import { FDButton } from "./lib/button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledSelect = styled.select`
  appearance: none;
  color: ${colors.black};
  padding: 2px 8px;
  background-color: ${colors.white};
  border-color: ${colors.accentDark};
  border-radius: 5px;
  font-size: 16px;
  font-family: sans-serif;
  margin-top: 4px;
  width: 100%;
`;
const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CheckButton = styled(FDButton).attrs({ size: 1, mt: 4 })<{
  uff: boolean;
}>`
  background-color: ${(p) => (p.uff ? "darkgreen" : "red")};
  padding: 0px 3px;
`;

const SmallButton = styled(FDButton).attrs({ mt: 4 })`
  font-weight: bold;
`;
const SelectWrapper = styled.div`
  position: relative;
  ::before {
    content: "\u25BE";
    position: absolute;
    right: 8px;
    top: 8px;
    font-family: sans-serif;
    color: ${colors.black};
  }
`;
export const Action: React.FC<{
  setNewRow: (newRow: Buffer) => void;
  addPage: () => number;
  pages: number[];
  loadMode: EAction;
  loadKeys: number[];
  loadPage: number;
}> = ({ setNewRow, pages, loadMode, loadKeys, loadPage, addPage }) => {
  const [mode, setMode] = useState<EAction>(loadMode);
  const [goTo, setGoTo] = useState<number>(loadPage);
  const [alt, setAlt] = useState<boolean>(loadKeys.includes(0xe2));
  const [ctrl, setCtrl] = useState<boolean>(loadKeys.includes(0xe0));
  const [shift, setShift] = useState<boolean>(loadKeys.includes(0xe1));
  const [superKey, setSuper] = useState<boolean>(loadKeys.includes(0xe3));
  const [keys, setKeys] = useState<number>(
    loadKeys?.[loadKeys.length - 1] ?? 0
  );

  useEffect(() => {
    if (loadMode !== mode) {
      setMode(loadMode);
    }
  }, [loadMode]);

  useEffect(() => {
    if (loadKeys?.[loadKeys.length - 1]) {
      setKeys(loadKeys?.[loadKeys.length - 1] ?? 194);
    }
  }, [loadKeys]);

  useEffect(() => {
    setGoTo(loadPage);
  }, [loadPage]);

  useEffect(() => {
    if (mode === EAction.changeLayout) {
      const row = new Buffer(16);
      row.writeUInt8(1, 0);
      row.writeInt16LE(goTo, 1);
      setNewRow(row);
    } else if (mode === EAction.keyboard) {
      let i = 1;
      const row = new Buffer(16);
      row.writeUInt8(0, 0);
      if (ctrl) row.writeUInt8(0xe0, i++);
      if (shift) row.writeUInt8(0xe1, i++);
      if (alt) row.writeUInt8(0xe2, i++);
      if (superKey) row.writeUInt8(0xe3, i++);
      row.writeUInt8(Math.max(0, Math.min(keys, 255)), i);
      setNewRow(row);
    } else if (mode === EAction.special_keys) {
      const row = new Buffer(16);
      row.writeUInt8(3, 0);
      row.writeInt16LE(keys, 1);
      setNewRow(row);
    } else if (mode === EAction.noop) {
      const row = new Buffer(16);
      row.writeUInt8(2, 0);
      setNewRow(row);
    }
  }, [mode, goTo, keys, ctrl, shift, alt, superKey]);

  return (
    <Wrapper>
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
          <LabelRow>
            <CheckButton uff={ctrl} onClick={(e) => setCtrl(!ctrl)}>
              Ctrl
            </CheckButton>
            <CheckButton uff={shift} onClick={(e) => setShift(!shift)}>
              Shift
            </CheckButton>
            <CheckButton uff={alt} onClick={(e) => setAlt(!alt)}>
              Alt
            </CheckButton>
            <CheckButton uff={superKey} onClick={(e) => setSuper(!superKey)}>
              Win
            </CheckButton>
          </LabelRow>
          <SelectWrapper>
            <StyledSelect
              value={keys}
              onChange={(e) => setKeys(parseInt(e.target.value))}
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
              value={keys}
              onChange={(e) => setKeys(parseInt(e.target.value))}
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
