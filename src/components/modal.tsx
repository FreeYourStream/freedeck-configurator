import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { colors } from "../definitions/colors";

const Wrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #555555db;
  z-index: 1000;
  display: ${(p) => (p.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  position: relative;
  border: 1px solid ${colors.black};
  background: ${colors.gray};
  border-radius: 8px;
  min-width: 200px;
  min-height: 200px;
  justify-content: center;
  align-items: center;
  padding: 64px;
`;

const Close = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const Modal: React.FC<{ visible: boolean; setClose: () => void }> = ({
  visible,
  setClose,
  children,
}) => {
  const content = (
    <Wrapper visible={visible}>
      <Content>
        <Close onClick={() => setClose()}>
          <img width="24px" src="./close.png" alt="close" />
        </Close>
        {children}
      </Content>
    </Wrapper>
  );

  // @ts-ignore
  return ReactDOM.createPortal(content, document.querySelector("#modal"));
};
