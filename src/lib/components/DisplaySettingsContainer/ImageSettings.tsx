import c from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import { useDebounce } from "use-debounce";

import { colors } from "../../../definitions/colors";
import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../../../definitions/fonts";
import { IDisplay } from "../../../interfaces";
import { AppStateContext } from "../../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";
import { FDIconButton, Icon } from "../Button";
import { CtrlDuo } from "../CtrlDuo";
import { Icons } from "../Icons";
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

const Toggle: React.FC<{ $on: boolean; onClick?: any }> = ({
  $on,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={c(
      $on ? "bg-green-600 hover:bg-green-500" : "bg-danger-4 hover:bg-danger-3",
      "px-2 py-0.5 w-14 font-semibold rounded-sm text-center text-white"
    )}
  >
    {$on ? "I" : "O"}
  </div>
);

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
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.displaySettingsPages[pageIndex][displayIndex];

  const configDispatch = useContext(ConfigDispatchContext);

  const setBlack = (blackThreshold: number) => {
    display.imageSettings.blackThreshold = blackThreshold;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setWhite = (whiteThreshold: number) => {
    display.imageSettings.whiteThreshold = whiteThreshold;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setBrightness = (brightness: number) => {
    display.imageSettings.brightness = brightness;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setContrast = (contrast: number) => {
    display.imageSettings.contrast = contrast;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setInvert = (invert: boolean) => {
    display.imageSettings.invert = invert;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setDither = (dither: any) => {
    display.imageSettings.dither = dither;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setfontName = (font: string) => {
    display.textSettings.font = font;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setText = (text: string) => {
    display.textSettings.text = text;
    configDispatch.setDisplaySettings({
      displaySettings: display,
      pageIndex,
      buttonIndex: displayIndex,
    });
  };
  const setIconWidthMultiplier = (value: number) => {
    display.textWithIconSettings.iconWidthMultiplier = value;
    configDispatch.setDisplaySettings({
      displaySettings: display,
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
              <CtrlDuo>
                <Icon icon="fa/FaAdjust" color="white" />
                <Label>White Threshold:</Label>
              </CtrlDuo>
              <CtrlDuo>
                <StyledSlider
                  style={{ width: "180px" }}
                  min={0}
                  max={128}
                  step={1}
                  value={display.imageSettings.whiteThreshold}
                  onChange={(event) =>
                    setWhite(event.currentTarget.valueAsNumber)
                  }
                />
                <Value>{display.imageSettings.whiteThreshold}</Value>
              </CtrlDuo>
            </Row>
            <Row>
              <CtrlDuo>
                <Icon icon="fa/FaAdjust" color="black" />
                <Label>Black Threshold:</Label>
              </CtrlDuo>
              <CtrlDuo>
                <StyledSlider
                  style={{ width: "180px" }}
                  min={128}
                  max={255}
                  step={1}
                  value={display.imageSettings.blackThreshold}
                  onChange={(event) =>
                    setBlack(event.currentTarget.valueAsNumber)
                  }
                />
                <Value>{display.imageSettings.blackThreshold}</Value>
              </CtrlDuo>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <CtrlDuo>
                <Icon icon="md/MdBrightnessMedium" color="white" />
                <Label>Brightness:</Label>
              </CtrlDuo>
              <CtrlDuo>
                <StyledSlider
                  style={{ width: "180px" }}
                  min={-1}
                  max={1}
                  step={0.02}
                  value={display.imageSettings.brightness}
                  onChange={(event) =>
                    setBrightness(event.currentTarget.valueAsNumber)
                  }
                />
                <Value>{display.imageSettings.brightness}</Value>
              </CtrlDuo>
            </Row>
            <Row>
              <CtrlDuo>
                <Icon icon="fa/FaAdjust" color="black" />
                <Label>Contrast:</Label>
              </CtrlDuo>
              <CtrlDuo>
                <StyledSlider
                  style={{ width: "180px" }}
                  min={-1}
                  max={1}
                  step={0.02}
                  value={display.imageSettings.contrast}
                  onChange={(event) =>
                    setContrast(event.currentTarget.valueAsNumber)
                  }
                />
                <Value>{display.imageSettings.contrast}</Value>
              </CtrlDuo>
            </Row>
          </>
        )}

        <Row>
          <Label>Invert</Label>
          <Toggle
            $on={display.imageSettings.invert}
            onClick={() => setInvert(!display.imageSettings.invert)}
          />
        </Row>
        <Row>
          <Label>Dither</Label>
          <Toggle
            $on={display.imageSettings.dither}
            onClick={() => setDither(!display.imageSettings.dither)}
          />
        </Row>
      </Column>

      <Column>
        <Title>Text Settings</Title>
        <Row>
          <TextInput
            placeholder={"Enter text"}
            value={display.textSettings.text}
            onChange={(e) => setText(e.currentTarget.value)}
          />
        </Row>
        <Row>
          <CtrlDuo>
            <Icon icon="fa/FaFont" />
            <Label>Font:</Label>
          </CtrlDuo>
          <CtrlDuo>
            <StyledSelect
              style={{ width: "180px" }}
              defaultValue={display.textSettings.font}
              onChange={(e) => setfontName(e.currentTarget.value)}
            >
              <option value={fontSmaller}>smaller</option>
              <option value={fontSmall}>small</option>
              <option value={fontMedium}>medium</option>
              <option value={fontLarge}>large</option>
            </StyledSelect>
            <Value>{display.textSettings.font}</Value>
          </CtrlDuo>
        </Row>
        <Row>
          <CtrlDuo>
            <Icon icon="ai/AiOutlineColumnWidth" />
            <Label>Icon width:</Label>
          </CtrlDuo>
          <CtrlDuo>
            <StyledSlider
              style={{ width: "180px" }}
              disabled={!display.textSettings.text.length}
              min={0.1}
              max={0.9}
              step={0.01}
              value={display.textWithIconSettings.iconWidthMultiplier}
              onChange={(event) =>
                setIconWidthMultiplier(event.currentTarget.valueAsNumber)
              }
            />
            <Value>
              {display.textWithIconSettings.iconWidthMultiplier.toFixed(2)}
            </Value>
          </CtrlDuo>
        </Row>
      </Column>
    </Wrapper>
  );
};
