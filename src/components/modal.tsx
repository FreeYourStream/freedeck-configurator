import React from "react";
import ReactDOM from "react-dom";
import { AiFillCloseSquare } from "react-icons/ai";
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
  border-radius: 8px 0px 8px 8px;
  min-width: 200px;
  min-height: 200px;
  justify-content: center;
  align-items: center;
  padding: 64px;
`;

const Close = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
const CloseBackground = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: white;
`;

export const Modal: React.FC<{ visible: boolean; setClose: () => void }> = ({
  visible,
  setClose,
  children,
}) => {
  const content = (
    <Wrapper visible={visible}>
      <Content>
        <CloseBackground />
        <Close onClick={() => setClose()}>
          <AiFillCloseSquare size={30} color="red" />
        </Close>
        {children}
      </Content>
    </Wrapper>
  );

  // @ts-ignore
  return ReactDOM.createPortal(content, document.querySelector("#modal"));
};
