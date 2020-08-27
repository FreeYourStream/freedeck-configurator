import { IActionDisplay, IActionSettingPage, IImageDisplay } from "../App";
import { fontMedium } from "../components/Settings";
import { EAction } from "../lib/parse/parsePage";
export const defaultActionDisplay: IActionDisplay = {
  primary: {
    mode: EAction.noop,
    values: [],
    enabled: true,
  },
  secondary: {
    mode: EAction.noop,
    values: [],
    enabled: false,
  },
};
export const defaultImageDisplay: IImageDisplay = {
  text: "",
  imageSettings: {
    contrast: 0,
    dither: false,
    invert: false,
  },
  imageIsConverted: true,
  textWithIconSettings: {
    enabled: false,
    font: fontMedium,
  },
};
export const getDefaultActionPage = (
  width: number,
  height: number,
  previousPageIndex?: number
): IActionSettingPage => {
  const backButton: IActionDisplay = { ...defaultActionDisplay };
  const displays = Array<IActionDisplay>(width * height - 1).fill(
    defaultActionDisplay
  );
  if (previousPageIndex !== undefined) {
    backButton.primary.mode = EAction.changeLayout;
    backButton.primary.values = [previousPageIndex];
  }
  displays.unshift(backButton);
  return displays;
};
export const getDefaultImagePage = (width: number, height: number) => {
  const displays = Array<IImageDisplay>(width * height).fill(
    defaultImageDisplay
  );
  return displays;
};
