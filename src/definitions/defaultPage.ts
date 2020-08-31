import { merge } from "lodash";

import { IButton, IButtonPage, IDisplay } from "../App";
import { EAction } from "../lib/parse/parsePage";
import { fontMedium } from "./fonts";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type IDefaultImageDisplayOptions = RecursivePartial<IDisplay>;
export const getDefaultButton: () => IButton = () => ({
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
export const getDefaultDisplay: (
  options?: IDefaultImageDisplayOptions
) => IDisplay = (options) =>
  merge<IDisplay, IDefaultImageDisplayOptions | undefined>(
    {
      imageIsConverted: true,
      imageSettings: {
        contrast: 0.3,
        brightness: 0.3,
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
      previousDisplay: undefined,
      previousPage: undefined,
    },
    options
  );
export const getDefaultButtonPage = (
  width: number,
  height: number,
  previousPageIndex?: number
): IButtonPage => {
  const backButton: IButton = getDefaultButton();
  const displays: IButtonPage = Array<IButton>(width * height - 1).fill(
    getDefaultButton()
  );
  if (previousPageIndex !== undefined) {
    backButton.primary.mode = EAction.changeLayout;
    backButton.primary.values = [previousPageIndex];
  }
  displays.unshift(backButton);
  return [...displays];
};
export const getDefaultDisplayPage = (
  width: number,
  height: number,
  options?: IDefaultImageDisplayOptions
) => {
  const displays = Array<IDisplay>(width * height).fill(getDefaultDisplay());
  return [...displays];
};
