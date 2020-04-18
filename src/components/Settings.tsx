import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { stringSplice } from "../lib/stringSplice";
import useDebounce from "../lib/useDebounce";
import { StyledSelect, Row } from "./lib/misc";
import { FDButton, Button } from "./lib/button";
import {
  Column,
  Disabler,
  Title,
  Label,
  TextInput,
  CheckButton,
  MicroButton,
} from "./lib/misc";

const smaller = "fonts/smaller.fnt";
const small = "fonts/small.fnt";
const medium = "fonts/medium.fnt";
const large = "fonts/large.fnt";

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
const Wrapper = styled.div<{ show: boolean }>`
  display: ${(p) => (p.show ? "flex" : "none")};
`;

const ContrastValue = styled.p`
  line-height: 21px;
  margin: 0;
  color: ${colors.white};
  font-family: sans-serif;
  font-size: 16px;
  font-weight: bold;
`;
const MicroToggle = styled(FDButton).attrs({ size: 1 })`
  padding: 0px 4px;
`;

const EnableTextButton = styled(CheckButton)`
  margin-right: 4px;
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
  const debouncedText = useDebounce(text, 250);
  useEffect(() => {
    setSettings({ contrast, dither, invert, text, textEnabled, fontName });
  }, [contrast, dither, invert, debouncedText, textEnabled, fontName]);
  useEffect(() => {
    setDither(textOnly ? false : true);
    setContrast(textOnly ? 0.12 : -0.12);
  }, [textOnly]);
  return (
    <Wrapper show={show}>
      <Column>
        <Disabler
          disable={textOnly}
          title="These options are disable. Load an image by clicking on the black box or just enter some text"
        />
        <Title>Image Settings</Title>
        <Row>
          <Label>Contrast</Label>
          <ContrastValue>{contrast.toFixed(2)}</ContrastValue>
        </Row>
        <Row>
          <MicroButton
            onClick={() => setContrast(clamp(contrast + 0.1, -1, 1))}
          >
            ++
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(contrast + 0.02, -1, 1))}
          >
            +
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(contrast - 0.02, -1, 1))}
          >
            -
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(contrast - 0.1, -1, 1))}
          >
            --
          </MicroButton>
        </Row>
        <Row>
          <MicroToggle width="48%" onClick={() => setInvert(!invert)}>
            Invert
          </MicroToggle>

          <MicroToggle width="48%" onClick={() => setDither(!dither)}>
            Dither
          </MicroToggle>
        </Row>
        <Row>
          <EnableTextButton
            uff={textEnabled}
            width="33%"
            onClick={(e) => setTextEnable(!textEnabled)}
          >
            Text
          </EnableTextButton>
          <StyledSelect
            defaultValue={fontName}
            onChange={(e) => setfontName(e.currentTarget.value)}
          >
            <option value={smaller}>smaller</option>
            <option value={small}>small</option>
            <option value={medium}>medium</option>
            <option value={large}>large</option>
          </StyledSelect>
        </Row>
      </Column>

      <Column>
        <Title>Text</Title>
        <Row>
          <TextInput
            placeholder={"Enter text"}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </Row>
      </Column>
    </Wrapper>
  );
};
