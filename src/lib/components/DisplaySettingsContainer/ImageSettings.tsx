import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

import { IDisplay } from "../../../interfaces";
import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../../../definitions/fonts";
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
} from "../Misc";
import { DispatchContext, StateContext } from "../../../state";

const Wrapper = styled.div`
  display: flex;
  min-width: 500px;
`;

export interface ISettings {
  contrast: number;
  dither: boolean;
  invert: boolean;
  text: string;
  textEnabled: boolean;
  fontName: string;
}

export const ImageSettings: React.FC<{
  displayIndex: number;
  pageIndex: number;
}> = ({ displayIndex, pageIndex }) => {
  const state = useContext(StateContext);
  const display =
    pageIndex === -1
      ? state.defaultBackDisplay
      : state.displaySettingsPages[pageIndex][displayIndex];
  // console.log(
  //   pageIndex,
  //   displayIndex
  //   state.displaySettingsPages
  //     .map((page) => page.map((d) => d.textSettings.text))
  //     .toString()
  // );
  const dispatch = useContext(DispatchContext);

  const setBlack = (blackThreshold: number) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, blackThreshold },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setWhite = (whiteThreshold: number) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, whiteThreshold },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setBrightness = (brightness: number) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, brightness },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setContrast = (contrast: number) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, contrast },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setInvert = (invert: boolean) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, invert },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setDither = (dither: any) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        imageSettings: { ...display.imageSettings, dither },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setfontName = (font: string) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        textSettings: { ...display.textSettings, font },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setText = (text: string) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        textSettings: { ...display.textSettings, text },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setIconWidthMultiplier = (iconWidthMultiplier: number) => {
    dispatch.setDisplaySettings({
      displaySettings: {
        ...display,
        textWithIconSettings: {
          ...display.textWithIconSettings,
          iconWidthMultiplier,
        },
      },
      pageIndex,
      buttonIndex: displayIndex,
    });
  };

  return (
    <Wrapper>
      <Column>
        <Disabler
          disable={!display.originalImage}
          title="These options are disabled. Load an image by clicking on the black box or just enter some text"
        />
        <Title>Image Settings</Title>
        {!display.imageSettings.dither ? (
          <>
            <Row>
              <Label>White Threshold:</Label>
              <Value>{display.imageSettings.whiteThreshold}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={0}
                max={128}
                step={1}
                value={display.imageSettings.whiteThreshold}
                onChange={(event) =>
                  setWhite(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row>
              <Label>Black Threshold:</Label>
              <Value>{display.imageSettings.blackThreshold}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={128}
                max={255}
                step={1}
                value={display.imageSettings.blackThreshold}
                onChange={(event) =>
                  setBlack(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Label>Brightness:</Label>
              <Value>{display.imageSettings.brightness}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={-1}
                max={1}
                step={0.02}
                value={display.imageSettings.brightness}
                onChange={(event) =>
                  setBrightness(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row>
              <Label>Contrast:</Label>
              <Value>{display.imageSettings.contrast}</Value>
            </Row>
            <Row>
              <StyledSlider
                min={-1}
                max={1}
                step={0.02}
                value={display.imageSettings.contrast}
                onChange={(event) =>
                  setContrast(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
          </>
        )}

        <Row>
          <MicroToggle
            activated={display.imageSettings.invert}
            width="48%"
            onClick={() => setInvert(!display.imageSettings.invert)}
          >
            Invert
          </MicroToggle>

          <MicroToggle
            activated={display.imageSettings.dither}
            width="48%"
            onClick={() => setDither(!display.imageSettings.dither)}
          >
            Dither
          </MicroToggle>
        </Row>
        <Row>
          <Label>Icon width:</Label>
          <Value>
            {display.textWithIconSettings.iconWidthMultiplier.toFixed(2)}
          </Value>
        </Row>
        <Row>
          <StyledSlider
            disabled={!display.textSettings.text.length}
            min={0.1}
            max={0.9}
            step={0.01}
            value={display.textWithIconSettings.iconWidthMultiplier}
            onChange={(event) =>
              setIconWidthMultiplier(event.currentTarget.valueAsNumber)
            }
          />
        </Row>
      </Column>

      <Column>
        <Title>Text</Title>
        <Row>
          <TextInput
            placeholder={"Enter text"}
            value={display.textSettings.text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </Row>
        <Row>
          <Label>Font:</Label>
          <StyledSelect
            defaultValue={display.textSettings.font}
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
