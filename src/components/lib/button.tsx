import React from "react";
import styled from "styled-components";

import { colors } from "../../definitions/colors";

export const Button = styled.button<{ bgcolor?: string }>`
  border-radius: 2px;
  letter-spacing: 1px;
  font-size: 16px;
  padding: 8px;
  border-style: none;
  color: black;
  background-color: ${(p) => p.bgcolor ?? "fuchsia"};
  font-weight: bold;
  cursor: pointer;
`;

export const FDButtonInner = styled.div<{
  size: number;
  px?: number;
  py?: number;
}>`
  padding: ${(p) => (p.size === 1 ? "0px" : p.size === 2 ? "4px" : "8px")};
  ${(p) =>
    p.px
      ? "padding-left: " + p.px + "px;" + "padding-right: " + p.px + "px;"
      : ""}
  font-family: "Barlow", sans-serif;
  position: relative;
  font-weight: 500;
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 5px;
  border: solid 1px ${colors.accent};
  background: ${colors.accentDark};
  white-space: nowrap;
  /* padding: 16px 18px 14px; */
  transition: all 0.1s;
  box-shadow: 0px 0px 0px, 0px 0px 0px, 0px 6px 0px ${colors.accentDark},
    0px 0px 0px;
  cursor: pointer;
`;

const Font = styled.div<{ size: number }>`
  font-size: ${(p) => (p.size === 1 ? "16px" : p.size === 2 ? "20px" : "24px")};
`;

const Wrapper = styled.div<{ ml: number; mt: number; width: string }>`
  transition: all 0.1s;
  width: ${(p) => p.width};
  padding-bottom: 8px;
  margin-left: ${(p) => p.ml}px;
  margin-top: ${(p) => p.mt}px;
  :hover {
    padding-top: 6px;
    padding-bottom: 2px;
  }
  &:hover > ${FDButtonInner} {
    box-shadow: 0px 0px 0px, 0px 0px 0px, 0px 2px 0px ${colors.accentDark},
      0px 0px 0px;
  }

  :active {
    padding-top: 6px;
    padding-bottom: 0px;
  }
  &:active > ${FDButtonInner} {
    box-shadow: none;
  }
`;

export interface IFDButtonProps {
  children: any;
  onClick: (e: any) => void;
  background?: string;
  size?: 1 | 2 | 3;
  ml?: number;
  mt?: number;
  px?: number;
  py?: number;
  width?: string;
}

export const FDButton = (props: IFDButtonProps) => (
  <Wrapper ml={props.ml ?? 0} mt={props.mt ?? 0} width={props.width ?? "auto"}>
    <FDButtonInner size={props.size ?? 2} px={props.px} {...props}>
      <Font size={props.size ?? 2}>{props.children}</Font>
    </FDButtonInner>
  </Wrapper>
);
