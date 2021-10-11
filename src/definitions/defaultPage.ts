import { merge } from "lodash";

import { IButtonSettings, IButtonSettingsPage, IDisplay } from "../interfaces";
import { getBase64Image } from "../lib/image/base64Encode";
import { createDefaultBackDisplay } from "./defaultBackImage";
import { getEmptyConvertedImage } from "./emptyConvertedImage";
import { fontMedium } from "./fonts";
import { EAction } from "./modes";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type IDisplayOptions = RecursivePartial<IDisplay>;
export const createDefaultButtonSettings: () => IButtonSettings = () => ({
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
export const createDefaultDisplay: (options?: IDisplayOptions) => IDisplay = (
  options
) =>
  merge<IDisplay, IDisplayOptions | undefined>(
    {
      originalImage: null,
      convertedImage: getEmptyConvertedImage(),
      previewImage: getBase64Image(getEmptyConvertedImage()),
      imageSettings: {
        brightness: 0,
        contrast: 0,
        whiteThreshold: 64,
        blackThreshold: 192,
        dither: false,
        invert: false,
      },
      textSettings: {
        font: fontMedium,
        text: "",
      },
      textWithIconSettings: {
        iconWidthMultiplier: 0.35,
      },
      isGeneratedFromDefaultBackImage: false,
      previousDisplay: undefined,
      previousPage: undefined,
    },
    options
  );
export const createDefaultButtonSettingsPage = (
  width: number,
  height: number,
  previousPageIndex?: number
): IButtonSettingsPage => {
  const backButton: IButtonSettings = createDefaultButtonSettings();
  const displays: IButtonSettingsPage = Array<IButtonSettings>(
    width * height - 1
  ).fill(createDefaultButtonSettings());
  if (previousPageIndex !== undefined) {
    backButton.primary.mode = EAction.changePage;
    backButton.primary.values = [previousPageIndex];
  }
  displays.unshift(backButton);
  return [...displays];
};
export const createDefaultDisplayPage = async (
  width: number,
  height: number,
  previousPage?: number
) => {
  const displays = Array<IDisplay>(width * height).fill({
    ...createDefaultDisplay(),
  });
  if (previousPage) {
    displays[0] = await createDefaultBackDisplay(previousPage);
  }
  return [...displays];
};
