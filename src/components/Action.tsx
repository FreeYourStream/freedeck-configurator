import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { EKeys, Keys } from "../definitions/keys";
import { EAction } from "../lib/parse/parsePage";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledSelect = styled.select`
  background-color: white;
  border-radius: 2px;
  font-size: 16px;
  font-family: sans-serif;
  margin-top: 4px;
`;
const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CheckButton = styled.button<{uff: boolean}>`
  color: ${p => p.uff ? 'white' : 'black'};
  background-color: ${p => p.uff ? 'blue' : 'white'};
`

export const Action: React.FC<{
  setNewRow: (newRow: number[]) => void;
  pages: number[];
  loadMode: EAction;
  loadKeys: number[];
  loadPage: number;
}> = ({ setNewRow, pages, loadMode, loadKeys, loadPage }) => {
  const [mode, setMode] = useState<EAction>(loadMode);
  const [goTo, setGoTo] = useState<number>(loadPage);
  const [alt, setAlt] = useState<boolean>(loadKeys.includes(130));
  const [ctrl, setCtrl] = useState<boolean>(loadKeys.includes(128));
  const [shift, setShift] = useState<boolean>(loadKeys.includes(129));
  const [superKey, setSuper] = useState<boolean>(loadKeys.includes(131));
  const [keys, setKeys] = useState<number>(
    loadKeys?.[loadKeys.length - 1] ?? -1
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
      setNewRow([1, goTo]);
    } else if (mode === EAction.keyboard) {
      const newRow = [0];
      if (ctrl) newRow.push(128);
      if (shift) newRow.push(129);
      if (alt) newRow.push(130);
      if (superKey) newRow.push(131);
      newRow.push(keys);
      setNewRow(newRow);
    } else if (mode === EAction.noop) {
      setNewRow([2]);
    }
  }, [mode, goTo, keys, ctrl, shift, alt, superKey]);

  return (
    <Wrapper>
      <StyledSelect
        value={mode}
        onChange={e => setMode(parseInt(e.target.value))}
      >
        <option value="0">Send Keys</option>
        <option value="1">Change Page</option>
        <option value="2">Do nothing</option>
      </StyledSelect>
      {mode === 0 && (
        <>
          <LabelRow>
            <CheckButton uff={ctrl} onClick={e=>setCtrl(!ctrl)} >Ctrl</CheckButton>
            <CheckButton uff={shift} onClick={e=>setShift(!shift)} >Shift</CheckButton>
            <CheckButton uff={alt} onClick={e=>setAlt(!alt)} >Alt</CheckButton>
            <CheckButton uff={superKey} onClick={e=>setSuper(!superKey)} >Win</CheckButton>
          </LabelRow>

          <StyledSelect
            value={keys}
            onChange={e => setKeys(parseInt(e.target.value))}
          >
            {Keys.map(enumKey => (
              //@ts-ignore
              <option key={enumKey} value={EKeys[enumKey]}>
                {enumKey}
              </option>
            ))}
          </StyledSelect>
        </>
      )}
      {mode === 1 && (
        <StyledSelect
          value={goTo}
          onChange={e => setGoTo(parseInt(e.target.value))}
        >
          <option value={-1}>Select Page</option>
          {pages.map(pageNumber => (
            <option key={pageNumber} value={pageNumber}>
              Go to {pageNumber}
            </option>
          ))}
        </StyledSelect>
      )}
    </Wrapper>
  );
};
