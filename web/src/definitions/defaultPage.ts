import merge from "lodash/merge";
import { v4 } from "uuid";

import {
  FDSettings,
  IButtonSettings,
  IDisplayButton,
  IDisplaySettings,
  IPage,
  textPosition,
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
    values: {
      changePage: "",
      hotkeys: [],
      settings: {},
      special_keys: [],
      text: [],
      noop: undefined,
    },
    enabled: true,
  },
  secondary: {
    mode: EAction.noop,
    values: {
      changePage: "",
      hotkeys: [],
      settings: {},
      special_keys: [],
      text: [],
      noop: undefined,
    },
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
        position: textPosition.right,
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
  previousPage?: string
): Promise<IPage> => {
  const page: IPage = {
    name: "",
    displayButtons: [],
    id: v4(),
  };
  for (var i = 0; i < count; i++) {
    page.displayButtons.push(await createDefaultDisplayButton());
  }
  if (previousPage !== undefined) {
    page.displayButtons[0].button.primary.mode = EAction.changePage;
    page.displayButtons[0].button.primary.values.changePage = previousPage;
    page.displayButtons[0].display = await createDefaultBackDisplay(
      previousPage
    );
  }
  return page;
};
