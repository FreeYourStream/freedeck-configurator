import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

import { IImageDisplay } from "../App";
import { colors } from "../definitions/colors";
import { FDButton } from "./lib/button";
import {
  MicroToggle,
  Row,
  StyledSelect,
  StyledSlider,
  Value,
} from "./lib/misc";
import {
  CheckButton,
  Column,
  Disabler,
  Label,
  TextInput,
  Title,
} from "./lib/misc";

export const fontSmaller = "fonts/smaller.fnt";
export const fontSmall = "fonts/small.fnt";
export const fontMedium = "fonts/medium.fnt";
export const fontLarge = "fonts/large.fnt";

const Wrapper = styled.div`
  display: flex;
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
  textOnly: boolean;
  settings: IImageDisplay["imageSettings"];
  textSettings: IImageDisplay["textWithIconSettings"];
  text: IImageDisplay["text"];
  setText: (text: string) => void;
}> = ({
  setSettings,
  textOnly,
  settings,
  setTextSettings,
  text,
  textSettings,
  setText: setTextValue,
}) => {
  const [localText, setLocalText] = useState<string>(text);
  const [localContrast, setLocalContrast] = useState<number>(settings.contrast);
  const [localIconWidth, setLocalIconWidth] = useState<number>(
    textSettings.iconWidthMultiplier
  );
  const [debouncedText] = useDebounce(localText, 33, {
    maxWait: 33,
    leading: true,
  });
  const [debouncedContrast] = useDebounce(localContrast, 33, {
    maxWait: 33,
    leading: true,
  });
  const [debouncedIconWidth] = useDebounce(localIconWidth, 33, {
    maxWait: 33,
    leading: true,
  });

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
  const setIconWidthMultiplier = useCallback(
    (value: number) => {
      setTextSettings({ ...textSettings, iconWidthMultiplier: value });
    },
    [setTextSettings, textSettings]
  );
  useEffect(() => {
    setText(debouncedText);
    // dont put setText there, we will have an endless loop if you do
    // @ts-ignore
  }, [debouncedText]);
  useEffect(() => {
    setContrast(debouncedContrast);
  }, [debouncedContrast]);
  useEffect(() => {
    setIconWidthMultiplier(debouncedIconWidth);
  }, [debouncedIconWidth]);
  return (
    <Wrapper>
      <Column>
        <Disabler
          disable={textOnly}
          title="These options are disabled. Load an image by clicking on the black box or just enter some text"
        />
        <Title>Image Settings</Title>
        <Row>
          <Label>Contrast:</Label>
          <Value>{settings.contrast.toFixed(2)}</Value>
        </Row>
        <Row>
          <StyledSlider
            min={-1}
            max={1}
            step={0.02}
            value={localContrast}
            onChange={(event) =>
              setLocalContrast(event.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <MicroToggle
            activated={settings.invert}
            width="30%"
            onClick={() => setInvert(!settings.invert)}
          >
            Invert
          </MicroToggle>

          <MicroToggle
            activated={settings.dither}
            width="30%"
            onClick={() => setDither(!settings.dither)}
          >
            Dither
          </MicroToggle>
          <MicroToggle
            activated={textSettings.enabled}
            width="30%"
            onClick={(e) => setTextEnable(!textSettings.enabled)}
          >
            Text
          </MicroToggle>
        </Row>
        <Row>
          <Label>Icon width:</Label>
          <Value>{textSettings.iconWidthMultiplier.toFixed(2)}</Value>
        </Row>
        <Row>
          <StyledSlider
            disabled={!textSettings.enabled}
            min={0.1}
            max={0.9}
            step={0.01}
            value={localIconWidth}
            onChange={(event) =>
              setLocalIconWidth(event.currentTarget.valueAsNumber)
            }
          />
        </Row>
      </Column>

      <Column>
        <Title>Text</Title>
        <Row>
          <TextInput
            placeholder={"Enter text"}
            value={localText}
            onChange={(e) => setLocalText(e.currentTarget.value)}
          />
        </Row>
        <Row>
          <Label>Font:</Label>
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
    </Wrapper>
  );
};
