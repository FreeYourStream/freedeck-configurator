import { EAction } from "./definitions/modes";

export enum FDSettings {
  "change_brightness" = 0,
  "absolute_brightness",
}
export interface IButtonSetting {
  mode: EAction;
  values: {
    hotkeys: number[];
    changePage: string;
    noop: undefined;
    special_keys: number;
    text: number[];
    settings: {
      setting?: FDSettings;
      value?: number;
    };
  };
  enabled: boolean;
}

export interface IButtonSettings {
  primary: IButtonSetting;
  secondary: IButtonSetting;
}

export enum textPosition {
  right,
  bottom,
}
export interface ITextSettings {
  position: textPosition;
  text: string;
  font: string;
}
export interface IImageSettings {
  dither: boolean;
  blackThreshold: number;
  contrast: number;
  brightness: number;
  whiteThreshold: number;
  invert: boolean;
}

export interface ITextWithIconSettings {
  iconWidthMultiplier: number;
}

export type IOriginalImage = Buffer | null;
export type IOriginalImagePage = IOriginalImage[];
export type IConvertedImage = Buffer;
export type IConvertedImagePage = IConvertedImage[];
export interface IDisplaySettings {
  imageSettings: IImageSettings;
  textSettings: ITextSettings;
  textWithIconSettings: ITextWithIconSettings;
  isGeneratedFromDefaultBackImage: boolean;
  previousPage?: string;
  previousDisplay?: number;
  originalImage: IOriginalImage;
  convertedImage: IConvertedImage;
  previewImage: string;
}

export interface IDisplayButton {
  display: IDisplaySettings;
  button: IButtonSettings;
}

export interface IPage {
  name: string;
  windowName?: string;
  isInCollection?: string;
  displayButtons: IDisplayButton[];
}

export type IPages = {
  byId: { [pageId: string]: IPage };
  sorted: string[];
};

export interface ICollection {
  name: string;
  windowName?: string;
  pages: string[];
}

export interface ICollections {
  byId: { [collectionId: string]: ICollection };
  sorted: string[];
}
