import merge from "lodash/merge";
import {
  IButtonSettings,
  IDisplayButton,
  IDisplaySettings,
  IPage,
} from "../interfaces";
import { getBase64Image } from "../lib/image/base64Encode";
import { createDefaultBackDisplay } from "./defaultBackImage";
import { getEmptyConvertedImage } from "./emptyConvertedImage";
import { fontMedium } from "./fonts";
import { EAction } from "./modes";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export type IDisplayOptions = RecursivePartial<IDisplaySettings>;
const createDefaultButton: () => IButtonSettings = () => ({
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
export const createDefaultDisplay: (
  options?: IDisplayOptions
) => IDisplaySettings = (options) =>
  merge<IDisplaySettings, IDisplayOptions | undefined>(
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
export const createDefaultDisplayButton = async (
  displayOptions?: RecursivePartial<IDisplaySettings>
): Promise<IDisplayButton> => {
  return {
    button: createDefaultButton(),
    display: await createDefaultDisplay(displayOptions),
  };
};

export const createDefaultPage = async (
  count: number,
  previousPage?: number
): Promise<IPage> => {
  const page: IPage = [];
  for (var i = 0; i < count; i++) {
    page.push(await createDefaultDisplayButton());
  }
  if (previousPage !== undefined) {
    page[0].button.primary.mode = EAction.changePage;
    page[0].button.primary.values = [previousPage];
    page[0].display = await createDefaultBackDisplay(previousPage);
  }
  return page;
};
