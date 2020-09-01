import styled from "styled-components";

import { colors } from "../definitions/colors";
import { FDButton } from "./button";

export const TextInput = styled.textarea.attrs({ rows: 4 })`
  appearance: none;
  margin-bottom: 8px;
  resize: none;
  color: ${colors.black};
  padding: 2px 8px;
  background-color: ${colors.white};
  border-color: ${colors.accentDark};
  border-radius: 5px;
  font-size: 16px;
  font-family: sans-serif;
  width: 100%;
`;
export const Title = styled.div<{ divider?: boolean; big?: boolean }>`
  color: ${colors.white};
  ${(p) => (p.divider ? `border-bottom: 1px solid ${colors.white};` : "")}

  ${(p) =>
    p.big
      ? `font-size: 28px;`
      : "font-size: 24px;"}
  font-family: "Barlow", sans-serif;
  text-align: center;
  line-height: 32px;
  vertical-align: middle;
  margin-bottom: 8px;
`;
export const Label = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  color: ${(p) => (p.color ? p.color : colors.white)};
  white-space: nowrap;
  font-size: 20px;
  margin-right: 8px;
  font-family: "Barlow", sans-serif;
`;
export const Value = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  color: ${colors.white};
  font-family: "Barlow", sans-serif;
  font-size: 20px;
  font-weight: bold;
`;
export const Column = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 50%;
`;
export const Disabler = styled.div<{ disable: boolean }>`
  z-index: 1001;
  display: ${(p) => (p.disable ? "block" : "none")};
  background: ${(p) => (p.disable ? colors.gray + "aa" : "transparent")};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export const CheckButton = styled(FDButton).attrs({ size: 1 })<{
  activated: boolean;
}>`
  background-color: ${(p) => (p.activated ? "darkgreen" : "red")};
  padding: 0px 3px;
`;
export const MicroButton = styled(FDButton).attrs({ size: 1 })`
  min-width: 36px;
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
  margin-top: 8px;
  width: 100%;
`;
export const SelectWrapper = styled.div`
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
export const Row = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-content: center;
  margin-top: 8px;
  min-height: 20px;
`;
export const WrapRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const MicroToggle = styled(CheckButton)`
  margin-right: 4px;
`;

export const StyledSlider = styled.input.attrs({ type: "range" })`
  width: 100%;
`;
