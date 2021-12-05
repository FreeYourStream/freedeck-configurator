import Joi from "joi";

import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../definitions/fonts";
import {
  IDisplaySettings,
  IImageSettings,
  ITextSettings,
  ITextWithIconSettings,
  textPosition,
} from "../interfaces";

export const TextWithIconSettingsSchema = Joi.object<ITextWithIconSettings>({
  iconWidthMultiplier: Joi.number().min(0).max(1).default(0.35),
}).meta({
  className: "TextWithIconSettings",
});

export const TextSettingsSchema = Joi.object<ITextSettings>({
  font: Joi.string().valid(fontSmaller, fontSmall, fontMedium, fontLarge),
  text: Joi.string().default(""),
  position: Joi.number()
    .valid(textPosition.bottom, textPosition.right)
    .default(textPosition.right),
}).meta({
  className: "TextSettings",
});

export const ImageSettingsSchema = Joi.object<IImageSettings>({
  blackThreshold: Joi.number().default(192),
  whiteThreshold: Joi.number().default(64),
  brightness: Joi.number().default(0),
  contrast: Joi.number().default(0),
  dither: Joi.bool().default(false),
  invert: Joi.bool().default(false),
}).meta({
  className: "ImageSettings",
});

export const DisplaySchema = Joi.object<IDisplaySettings>({
  convertedImage: Joi.binary().required(),
  imageSettings: ImageSettingsSchema.required(),
  isGeneratedFromDefaultBackImage: Joi.bool().required(),
  originalImage: Joi.binary(),
  previewImage: Joi.string().required(),
  textSettings: TextSettingsSchema.required(),
  textWithIconSettings: TextWithIconSettingsSchema.required(),
}).meta({
  className: "Display",
});
