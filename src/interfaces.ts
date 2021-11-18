import { EAction } from "./definitions/modes";

export interface IButtonSetting {
  mode: EAction;
  values: number[];
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
  previousPage?: number;
  previousDisplay?: number;
  originalImage: IOriginalImage;
  convertedImage: IConvertedImage;
  previewImage: string;
}

export type IDisplayButton = {
  display: IDisplaySettings;
  button: IButtonSettings;
};

export type IPage = IDisplayButton[];
