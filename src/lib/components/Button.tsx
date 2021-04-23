import React from "react";
import styled from "styled-components";

import { colors } from "../../definitions/colors";
import { Icons } from "./Icons";

export const FDButtonInner = styled.div<{
  size: number;
  px?: number;
  py?: number;
  disabled?: boolean;
  type: "danger" | "normal";
}>`
  padding: ${(p) => (p.size === 1 ? "0px" : p.size === 2 ? "4px" : "8px")};
  ${(p) => (p.px ? `padding-left: ${p.px}px;padding-right: ${p.px}px;` : "")}
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
  border: solid 1px ${(p) => (!p.disabled ? colors.accent : colors.white)};
  background-color: ${(p) =>
    p.type === "danger" ? " #c54800" : colors.accentDark};
  ${(p) => p.disabled && `background-color: ${colors.lightGray};`}
  white-space: nowrap;
  transition: all 0.1s;
  box-shadow: 0px 0px 0px, 0px 0px 0px,
    0px 6px 0px ${(p) => (!p.disabled ? colors.accentDark : colors.lightGray)},
    0px 0px 0px;
  cursor: pointer;
  user-select: none;
`;

const Font = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => (p.size === 1 ? "16px" : p.size === 2 ? "20px" : "24px")};
`;
export const Spacer = styled.div<{ mr: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(p) => p.mr}px;
`;
const Wrapper = styled.div<{
  ml: number;
  mt: number;
  width: string;
  disabled: boolean;
}>`
  transition: all 0.1s;
  width: ${(p) => p.width};
  padding-bottom: 8px;
  margin-left: ${(p) => p.ml}px;
  margin-top: ${(p) => p.mt}px;
  ${(p) =>
    !p.disabled &&
    `:hover {
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
  }`}
`;
const Label = styled.label``;

export interface IFDButtonProps {
  disabled?: boolean;
  type?: "danger" | "normal";
  children?: any;
  htmlFor?: any;
  onClick?: (e: any) => void;
  background?: string;
  size?: 1 | 2 | 3;
  ml?: number;
  mt?: number;
  px?: number;
  py?: number;
  width?: string;
}

export const FDButton = (props: IFDButtonProps) => (
  <Wrapper
    ml={props.ml ?? 0}
    mt={props.mt ?? 0}
    width={props.width ?? "auto"}
    disabled={props.disabled ?? false}
  >
    <FDButtonInner
      type={props.type ?? "normal"}
      size={props.size ?? 2}
      px={props.px}
      {...props}
      onClick={props.disabled ? () => undefined : props.onClick}
    >
      <Font size={props.size ?? 2}>{props.children}</Font>
    </FDButtonInner>
  </Wrapper>
);
export const FDIconButton = (props: IFDButtonProps & { icon?: string }) => {
  const Icon =
    //@ts-ignore
    props.icon && Icons[props.icon.split("/")[0]][props.icon.split("/")[1]];
  return (
    <Label htmlFor={props.htmlFor}>
      <Wrapper
        ml={props.ml ?? 0}
        mt={props.mt ?? 0}
        width={props.width ?? "auto"}
        disabled={props.disabled ?? false}
      >
        <FDButtonInner
          type={props.type ?? "normal"}
          size={props.size ?? 2}
          px={props.px}
          {...props}
        >
          {props.icon && Icon ? (
            <Spacer mr={props.children?.length ? 4 : 0}>
              <Icon size={22} />
            </Spacer>
          ) : (
            ""
          )}
          {props.children?.length && (
            <Font size={props.size ?? 2}>{props.children}</Font>
          )}
        </FDButtonInner>
      </Wrapper>
    </Label>
  );
};

const FixedWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 25px;
`;

export const FDIconButtonFixed = (
  props: IFDButtonProps & { icon?: string }
) => {
  return (
    <FixedWrapper>
      <FDIconButton {...props} />
    </FixedWrapper>
  );
};
