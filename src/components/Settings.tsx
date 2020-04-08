import Jimp from "jimp";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { StyledSelect } from "./Action";
import { FDButton } from "./lib/button";

const smaller = "fonts/smaller.fnt";
const small = "fonts/small.fnt";
const medium = "fonts/medium.fnt";
const large = "fonts/large.fnt";

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px;
`;
const SettingsButtons = styled.div<{ show: boolean }>`
  border: 1px solid ${colors.accent};
  position: absolute;
  top: -145px;
  display: ${(p) => (p.show ? "flex" : "none")};
  flex-direction: column;
  width: 100%;
  height: 140px;
  width: 158px;
  background: ${colors.black};
  border-radius: 4px;
  z-index: 1;
`;
const ContrastValue = styled.p`
  line-height: 21px;
  margin: 0;
  color: ${colors.white};
  font-family: sans-serif;
  font-size: 16px;
  font-weight: bold;
`;
const MicroButton = styled(FDButton).attrs({ size: 1 })`
  min-width: 36px;
`;
const MicroToggle = styled(FDButton).attrs({ size: 1 })`
  padding: 0px 4px;
`;
const CheckButton = styled(FDButton).attrs({ size: 1, mt: 4 })<{
  uff: boolean;
}>`
  background-color: ${(p) => (p.uff ? "darkgreen" : "red")};
  padding: 0px 3px;
`;
const EnableTextButton = styled(CheckButton)`
  margin-right: 4px;
`;
const TextInput = styled.input.attrs({ type: "text" })`
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

export const Settings: React.FC<{
  setSettings: (settings: {
    contrast: number;
    dither: boolean;
    invert: boolean;
    text: string;
    textEnabled: boolean;
    fontName: string;
  }) => void;
  show: boolean;
  textOnly: boolean;
}> = ({ setSettings, show, textOnly }) => {
  const [contrast, setContrast] = useState<number>(textOnly ? 0.12 : -0.12);
  const [dither, setDither] = useState<boolean>(textOnly ? false : true);
  const [invert, setInvert] = useState<boolean>(false);
  const [textEnabled, setTextEnable] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [fontName, setfontName] = useState<string>(textOnly ? large : medium);

  useEffect(() => {
    setSettings({ contrast, dither, invert, text, textEnabled, fontName });
  }, [contrast, dither, invert, text, textEnabled, fontName]);
  useEffect(() => {
    setDither(textOnly ? false : true);
    setContrast(textOnly ? 0.12 : -0.12);
  }, [textOnly]);
  return (
    <SettingsButtons show={show}>
      <ButtonRow>
        <MicroButton onClick={() => setContrast(clamp(contrast + 0.1, -1, 1))}>
          ++
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast + 0.02, -1, 1))}>
          +
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast - 0.02, -1, 1))}>
          -
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast - 0.1, -1, 1))}>
          --
        </MicroButton>
      </ButtonRow>
      <ButtonRow>
        <MicroToggle onClick={() => setInvert(!invert)}>invert</MicroToggle>
        <ContrastValue>{contrast.toFixed(2)}</ContrastValue>
        <MicroToggle onClick={() => setDither(!dither)}>dither</MicroToggle>
      </ButtonRow>
      <ButtonRow>
        {!textOnly && (
          <EnableTextButton
            uff={textEnabled}
            onClick={(e) => setTextEnable(!textEnabled)}
          >
            Text
          </EnableTextButton>
        )}
        <StyledSelect
          defaultValue={fontName}
          onChange={(e) => setfontName(e.currentTarget.value)}
        >
          <option value={smaller}>smaller</option>
          <option value={small}>small</option>
          <option value={medium}>medium</option>
          <option value={large}>large</option>
        </StyledSelect>
      </ButtonRow>
      <ButtonRow>
        <TextInput
          placeholder={"Enter text"}
          onKeyUp={(e) => e.keyCode === 13 && setText(text + "|")}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </ButtonRow>
    </SettingsButtons>
  );
};
