import React, { useCallback } from "react";
import styled from "styled-components";

import { IImageDisplay } from "../App";
import { colors } from "../definitions/colors";
import { FDButton } from "./lib/button";
import { Row, StyledSelect } from "./lib/misc";
import {
  CheckButton,
  Column,
  Disabler,
  Label,
  MicroButton,
  TextInput,
  Title,
} from "./lib/misc";

export const fontSmaller = "fonts/smaller.fnt";
export const fontSmall = "fonts/small.fnt";
export const fontMedium = "fonts/medium.fnt";
export const fontLarge = "fonts/large.fnt";

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

export interface ISettings {
  contrast: number;
  dither: boolean;
  invert: boolean;
  text: string;
  textEnabled: boolean;
  fontName: string;
}

export const Settings: React.FC<{
  setSettings: (settings: IImageDisplay["imageSettings"]) => void;
  setTextSettings: (settings: IImageDisplay["textWithIconSettings"]) => void;
  show: boolean;
  textOnly: boolean;
  settings: IImageDisplay["imageSettings"];
  textSettings: IImageDisplay["textWithIconSettings"];
  text: IImageDisplay["text"];
  setText: (text: string) => void;
}> = ({
  setSettings,
  show,
  textOnly,
  settings,
  setTextSettings,
  text,
  textSettings,
  setText: setTextValue,
}) => {
  // const [contrast, setContrast] = useState<number>(settings.contrast);
  // const [dither, setDither] = useState<boolean>(settings.dither);
  // const [invert, setInvert] = useState<boolean>(settings.invert);
  // const [textEnabled, setTextEnable] = useState<boolean>(settings.textEnabled);
  // const [text, setText] = useState<string>(settings.text);
  // const [fontName, setfontName] = useState<string>(settings.fontName);
  // const debouncedText = useDebounce(text, 250);

  // useEffect(() => {
  //   setSettings({ contrast, dither, invert, text, textEnabled, fontName });
  // }, [contrast, dither, invert, debouncedText, textEnabled, fontName]);

  // useEffect(() => {
  //   if (textOnly) return;
  //   setContrast(settings.contrast);
  //   setDither(settings.dither);
  //   setInvert(settings.invert);
  //   setTextEnable(settings.textEnabled);
  //   setText(settings.text);
  //   setfontName(settings.fontName);
  // }, [settings]);
  const setContrast = useCallback(
    (contrast: number) => {
      setSettings({ ...settings, contrast });
    },
    [settings, setSettings]
  );
  const setInvert = useCallback(
    (invert: boolean) => {
      setSettings({ ...settings, invert });
    },
    [settings, setSettings]
  );
  const setDither = useCallback(
    (dither: any) => {
      setSettings({ ...settings, dither });
    },
    [settings, setSettings]
  );
  const setTextEnable = useCallback(
    (enabled: boolean) => {
      setTextSettings({ ...textSettings, enabled });
    },
    [textSettings, setTextSettings]
  );
  const setfontName = useCallback(
    (font: string) => {
      setTextSettings({ ...textSettings, font });
    },
    [textSettings, setTextSettings]
  );
  const setText = useCallback(
    (text: string) => {
      setTextValue(text);
    },
    [setTextValue]
  );
  return (
    <Wrapper show={show}>
      <Column>
        <Disabler
          disable={textOnly}
          title="These options are disabled. Load an image by clicking on the black box or just enter some text"
        />
        <Title>Image Settings</Title>
        <Row>
          <Label>Contrast</Label>
          <ContrastValue>{settings.contrast.toFixed(2)}</ContrastValue>
        </Row>
        <Row>
          <MicroButton
            onClick={() => setContrast(clamp(settings.contrast + 0.1, -1, 1))}
          >
            ++
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(settings.contrast + 0.02, -1, 1))}
          >
            +
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(settings.contrast - 0.02, -1, 1))}
          >
            -
          </MicroButton>
          <MicroButton
            onClick={() => setContrast(clamp(settings.contrast - 0.1, -1, 1))}
          >
            --
          </MicroButton>
        </Row>
        <Row>
          <MicroToggle width="48%" onClick={() => setInvert(!settings.invert)}>
            Invert
          </MicroToggle>

          <MicroToggle width="48%" onClick={() => setDither(!settings.dither)}>
            Dither
          </MicroToggle>
        </Row>
        <Row>
          <EnableTextButton
            uff={textSettings.enabled}
            width="33%"
            onClick={(e) => setTextEnable(!textSettings.enabled)}
          >
            Text
          </EnableTextButton>
          <StyledSelect
            defaultValue={textSettings.font}
            onChange={(e) => setfontName(e.currentTarget.value)}
          >
            <option value={fontSmaller}>smaller</option>
            <option value={fontSmall}>small</option>
            <option value={fontMedium}>medium</option>
            <option value={fontLarge}>large</option>
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
