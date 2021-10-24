import {
  LightningBoltIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon,
  SwitchHorizontalIcon,
  TranslateIcon,
} from "@heroicons/react/outline";
import { SunIcon as SunIconAlt } from "@heroicons/react/solid";
import c from "clsx";
import React, { useContext } from "react";
import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../../definitions/fonts";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { Label, Value } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { FDSlider } from "../../lib/components/Slider";
import { Switch } from "../../lib/components/Switch";
import { TextInput } from "../../lib/components/TextInput";
import { Title } from "../../lib/components/Title";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

export const ImageSettings: React.FC<{
  displayIndex: number;
  pageIndex: number;
}> = ({ displayIndex, pageIndex }) => {
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.pages[pageIndex][displayIndex].display;

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
    <div className="grid grid-cols-2 gap-4 grid-rows-1 w-full h-full">
      <div className="relative flex flex-col p-8  bg-gray-700 rounded-2xl">
        <div
          className={c(
            "z-10 bg-gray-900 opacity-80 top-0 left-0 right-0 bottom-0 absolute rounded-2xl",
            display.originalImage ? "hidden" : "block"
          )}
          title="These options are disabled. Load an image by clicking on the black box or just enter some text"
        />
        <Title className="mb-2">Image Settings</Title>
        {!display.imageSettings.dither ? (
          <>
            <Row className="h-7">
              <CtrlDuo>
                <SunIconAlt className="h-7 w-7" />
                <Label>White Threshold</Label>
              </CtrlDuo>
              <FDSlider
                className="w-32"
                min={0}
                max={128}
                step={1}
                value={display.imageSettings.whiteThreshold}
                onChange={(event) =>
                  setWhite(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row className="h-7">
              <CtrlDuo>
                <SunIcon className="h-7 w-7" />
                <Label>Black Threshold</Label>
              </CtrlDuo>
              <FDSlider
                className="w-32"
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
            <Row className="h-7">
              <CtrlDuo>
                <SunIconAlt className="h-7 w-7" />
                <Label>Brightness:</Label>
              </CtrlDuo>
              <FDSlider
                min={-1}
                max={1}
                step={0.02}
                value={display.imageSettings.brightness}
                onChange={(event) =>
                  setBrightness(event.currentTarget.valueAsNumber)
                }
              />
            </Row>
            <Row className="h-7">
              <CtrlDuo>
                <MoonIcon className="h-7 w-7" />
                <Label>Contrast:</Label>
              </CtrlDuo>
              <FDSlider
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

        <Row className="h-7">
          <CtrlDuo>
            <RefreshIcon className="h-7 w-7" />
            <Label>Invert</Label>
          </CtrlDuo>
          <Switch
            onChange={(value) => setInvert(value)}
            value={display.imageSettings.invert}
          />
        </Row>
        <Row className="h-7">
          <CtrlDuo>
            <LightningBoltIcon className="h-7 w-7" />
            <Label>Dither</Label>
          </CtrlDuo>
          <Switch
            onChange={(value) => setDither(value)}
            value={display.imageSettings.dither}
          />
        </Row>
      </div>

      <div className="relative flex flex-col p-8 bg-gray-700 rounded-2xl">
        <Title className="mb-2">Text Settings</Title>
        <Row>
          <TextInput
            className="w-full"
            placeholder={"Enter text"}
            value={display.textSettings.text}
            onChange={(value) => setText(value)}
          />
        </Row>
        <Row>
          <CtrlDuo>
            <TranslateIcon className="h-7 w-7" />
            <Label>Font:</Label>
          </CtrlDuo>
          <CtrlDuo>
            <StyledSelect
              className="w-32"
              value={display.textSettings.font}
              onChange={(value) => setfontName(value)}
              options={[
                { value: fontSmaller, text: "xs" },
                { value: fontSmall, text: "medium" },
                { value: fontMedium, text: "large" },
                { value: fontLarge, text: "xl" },
              ]}
            />
            <Value>{display.textSettings.font}</Value>
          </CtrlDuo>
        </Row>
        <Row>
          <CtrlDuo>
            <SwitchHorizontalIcon className="h-7 w-7" />
            <Label>Icon width:</Label>
          </CtrlDuo>
          <FDSlider
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
      </div>
    </div>
  );
};
