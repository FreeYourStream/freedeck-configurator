import { merge } from "lodash";

import { IButton, IButtonPage, IDisplay } from "../App";
import { fontMedium } from "../components/Settings";
import { EAction } from "../lib/parse/parsePage";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type IDefaultImageDisplayOptions = RecursivePartial<IDisplay>;
export const getDefaultActionDisplay: () => IButton = () => ({
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
) => IDisplay = (options) =>
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
): IButtonPage => {
  const backButton: IButton = getDefaultActionDisplay();
  const displays: IButtonPage = Array<IButton>(width * height - 1).fill(
    getDefaultActionDisplay()
  );
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
  const displays = Array<IDisplay>(width * height).fill(
    getDefaultImageDisplay(options)
  );
  return [...displays];
};
