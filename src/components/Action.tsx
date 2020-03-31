import React, { useState, useEffect } from "react";
import { Keys, EKeys } from "../definitions/keys";
import styled from "styled-components";
import { EAction } from "../lib/parse/parsePage";

const Wrapper = styled.div``;

const ModeSelect = styled.select``;

const KeySelect = styled.select``;

const PageSelect = styled.select``;

export const Action: React.FC<{
  setNewRow: (newRow: number[]) => void;
  pages: number[];
  loadMode: EAction;
  loadKeys: number[];
  loadPage: number;
}> = ({ setNewRow, pages, loadMode, loadKeys, loadPage }) => {
  const [mode, setMode] = useState<EAction>(loadMode);
  const [goTo, setGoTo] = useState<number>(loadPage);
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
    if (loadPage != -1) {
      setGoTo(loadPage);
    }
  }, [loadPage]);

  useEffect(() => {
    if (mode === EAction.changeLayout) {
      setNewRow([1, goTo]);
    } else if (mode === EAction.keyboard) {
      setNewRow([0, 128, 129, keys]);
    } else if (mode === EAction.noop) {
      setNewRow([2]);
    }
  }, [mode, goTo, keys]);

  return (
    <Wrapper>
      <ModeSelect
        value={mode}
        onChange={e => setMode(parseInt(e.target.value))}
      >
        <option value="0">Send Keys</option>
        <option value="1">Change Page</option>
        <option value="2">Empty</option>
      </ModeSelect>
      {mode === 0 && (
        <KeySelect
          value={keys}
          onChange={e => setKeys(parseInt(e.target.value))}
        >
          {Keys.map(enumKey => (
            //@ts-ignore
            <option key={enumKey} value={EKeys[enumKey]}>
              {enumKey}
            </option>
          ))}
        </KeySelect>
      )}
      {mode === 1 && (
        <PageSelect
          value={goTo}
          onChange={e => setGoTo(parseInt(e.target.value))}
        >
          <option value={-1}>Select something</option>
          {pages.map(pageNumber => (
            <option key={pageNumber} value={pageNumber}>
              Go to {pageNumber}
            </option>
          ))}
        </PageSelect>
      )}
    </Wrapper>
  );
};
