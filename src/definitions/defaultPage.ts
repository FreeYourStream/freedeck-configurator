import { merge } from "lodash";

import { IActionDisplay, IActionSettingPage, IImageDisplay } from "../App";
import { fontMedium } from "../components/Settings";
import { EAction } from "../lib/parse/parsePage";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type IDefaultImageDisplayOptions = RecursivePartial<IImageDisplay>;
export const getDefaultActionDisplay: () => IActionDisplay = () => ({
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
});
export const getDefaultImageDisplay: (
  options?: IDefaultImageDisplayOptions
) => IImageDisplay = (options) =>
  merge(
    {
      imageIsConverted: true,
      imageSettings: {
        contrast: 0,
        dither: false,
        invert: false,
      },
      textSettings: {
        font: fontMedium,
        text: "",
      },
      textWithIconSettings: {
        enabled: false,
        iconWidthMultiplier: 0.35,
      },
      isGeneratedFromDefaultBackImage: false,
    },
    options
  );
export const getDefaultActionPage = (
  width: number,
  height: number,
  previousPageIndex?: number
): IActionSettingPage => {
  const backButton: IActionDisplay = getDefaultActionDisplay();
  const displays: IActionSettingPage = Array<IActionDisplay>(
    width * height - 1
  ).fill(getDefaultActionDisplay());
  if (previousPageIndex !== undefined) {
    backButton.primary.mode = EAction.changeLayout;
    backButton.primary.values = [previousPageIndex];
  }
  displays.unshift(backButton);
  return [...displays];
};
export const getDefaultImagePage = (
  width: number,
  height: number,
  options?: IDefaultImageDisplayOptions
) => {
  const displays = Array<IImageDisplay>(width * height).fill(
    getDefaultImageDisplay(options)
  );
  return [...displays];
};
