import { IActionDisplay, IActionPage, IImageDisplay } from "../App";
import { fontMedium } from "../components/Settings";
import { EAction } from "../lib/parse/parsePage";

export const getDefaultActionPage = (
  width: number,
  height: number,
  previousPageIndex?: number
): IActionPage => {
  const defaultDisplay: IActionDisplay = {
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
    _revision: 0,
  };
  const backButton: IActionDisplay = { ...defaultDisplay };
  const displays = Array<IActionDisplay>(width * height - 1).fill(
    defaultDisplay
  );
  if (previousPageIndex !== undefined) {
    backButton.primary.mode = EAction.changeLayout;
    backButton.primary.values = [previousPageIndex];
  }
  displays.unshift(backButton);
  return {
    displays,
  };
};
export const getDefaultImagePage = (width: number, height: number) => {
  const defaultDisplay: IImageDisplay = {
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
    _revision: 0,
  };
  const displays = Array<IImageDisplay>(width * height).fill(defaultDisplay);
  return {
    displays,
  };
};
