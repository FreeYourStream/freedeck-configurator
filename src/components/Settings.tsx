import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

import { IDisplay } from "../App";
import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../definitions/fonts";
import {
  Column,
  Disabler,
  Label,
  MicroToggle,
  Row,
  StyledSelect,
  StyledSlider,
  TextInput,
  Title,
  Value,
} from "../lib/components/misc";

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
  setImageSettings: (settings: IDisplay["imageSettings"]) => void;
  setTextSettings: (settings: IDisplay["textSettings"]) => void;
  setTextWithIconSettings: (settings: IDisplay["textWithIconSettings"]) => void;
  textOnly: boolean;
  imageSettings: IDisplay["imageSettings"];
  textWithIconSettings: IDisplay["textWithIconSettings"];
  textSettings: IDisplay["textSettings"];
}> = ({
  setImageSettings,
  setTextSettings,
  setTextWithIconSettings,
  textOnly,
  imageSettings,
  textWithIconSettings,
  textSettings,
}) => {
  const [localText, setLocalText] = useState<string>(textSettings.text);
  const [localWhite, setLocalWhite] = useState<number>(
    imageSettings.whiteThreshold
  );
  const [localBlack, setLocalBlack] = useState<number>(
    imageSettings.blackThreshold
  );
  const [localBrightness, setLocalBrightness] = useState<number>(
    imageSettings.brightness
  );
  const [localContrast, setLocalContrast] = useState<number>(
    imageSettings.contrast
  );
  const [localIconWidth, setLocalIconWidth] = useState<number>(
    textWithIconSettings.iconWidthMultiplier
  );
  const [debouncedText] = useDebounce(localText, 33, {
    maxWait: 33,
    leading: true,
  });
  const [debouncedWhite] = useDebounce(localWhite, 33, {
    maxWait: 33,
    leading: true,
  });
  const [debouncedBlack] = useDebounce(localBlack, 33, {
    maxWait: 33,
    leading: true,
  });
  const [debouncedBrightness] = useDebounce(localBrightness, 33, {
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
  const setBlack = useCallback(
    (blackThreshold: number) => {
      setImageSettings({ ...imageSettings, blackThreshold });
    },
    [imageSettings, setImageSettings]
  );
  const setWhite = useCallback(
    (whiteThreshold: number) => {
      setImageSettings({ ...imageSettings, whiteThreshold });
    },
    [imageSettings, setImageSettings]
  );
  const setBrightness = useCallback(
    (brightness: number) => {
      setImageSettings({ ...imageSettings, brightness });
    },
    [imageSettings, setImageSettings]
  );
  const setContrast = useCallback(
    (contrast: number) => {
      setImageSettings({ ...imageSettings, contrast });
    },
    [imageSettings, setImageSettings]
  );
  const setInvert = useCallback(
    (invert: boolean) => {
      setImageSettings({ ...imageSettings, invert });
    },
    [imageSettings, setImageSettings]
  );
  const setDither = useCallback(
    (dither: any) => {
      setImageSettings({ ...imageSettings, dither });
    },
    [imageSettings, setImageSettings]
  );
  const setTextEnable = useCallback(
    (enabled: boolean) => {
      setTextWithIconSettings({ ...textWithIconSettings, enabled });
    },
    [setTextWithIconSettings, textWithIconSettings]
  );
  const setfontName = useCallback(
    (font: string) => {
      setTextSettings({ ...textSettings, font });
    },
    [textSettings, setTextSettings]
  );
  const setText = useCallback(
    (text: string) => {
      setTextSettings({ ...textSettings, text });
    },
    [setTextSettings, textSettings]
  );
  const setIconWidthMultiplier = useCallback(
    (value: number) => {
      setTextWithIconSettings({
        ...textWithIconSettings,
        iconWidthMultiplier: value,
      });
    },
    [setTextWithIconSettings, textWithIconSettings]
  );
  useEffect(() => {
    setLocalText(textSettings.text);
    setLocalWhite(imageSettings.whiteThreshold);
    setLocalBlack(imageSettings.blackThreshold);
    setLocalBrightness(imageSettings.brightness);
    setLocalContrast(imageSettings.contrast);
    setLocalIconWidth(textWithIconSettings.iconWidthMultiplier);
  }, [imageSettings, textSettings, textWithIconSettings]);
  useEffect(() => {
    setText(debouncedText);
  }, [debouncedText]); // dont put setText there, we will have an endless loop if you do
  useEffect(() => {
    setWhite(debouncedWhite);
  }, [debouncedWhite]);
  useEffect(() => {
    setBlack(debouncedBlack);
  }, [debouncedBlack]);
  useEffect(() => {
    setBrightness(debouncedBrightness);
  }, [debouncedBrightness]);
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
        {!imageSettings.dither ? (
          <>
            <Row>
              <Label>White Threshold:</Label>
              <Value>{imageSettings.whiteThreshold}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={0}
                max={128}
                step={1}
                value={localWhite}
                onChange={(event) =>
                  setLocalWhite(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row>
              <Label>Black Threshold:</Label>
              <Value>{imageSettings.blackThreshold}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={128}
                max={255}
                step={1}
                value={localBlack}
                onChange={(event) =>
                  setLocalBlack(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Label>Brightness:</Label>
              <Value>{imageSettings.brightness}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={-1}
                max={1}
                step={0.02}
                value={localBrightness}
                onChange={(event) =>
                  setLocalBrightness(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row>
              <Label>Contrast:</Label>
              <Value>{imageSettings.contrast}</Value>
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
          </>
        )}
        <Title>Image Settings</Title>

        <Row>
          <MicroToggle
            activated={imageSettings.invert}
            width="30%"
            onClick={() => setInvert(!imageSettings.invert)}
          >
            Invert
          </MicroToggle>

          <MicroToggle
            activated={imageSettings.dither}
            width="30%"
            onClick={() => setDither(!imageSettings.dither)}
          >
            Dither
          </MicroToggle>
          <MicroToggle
            activated={textWithIconSettings.enabled}
            width="30%"
            onClick={(e) => setTextEnable(!textWithIconSettings.enabled)}
          >
            Text
          </MicroToggle>
        </Row>
        <Row>
          <Label>Icon width:</Label>
          <Value>{textWithIconSettings.iconWidthMultiplier.toFixed(2)}</Value>
        </Row>
        <Row>
          <StyledSlider
            disabled={!textWithIconSettings.enabled}
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
