import Joi from "joi";

import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../definitions/fonts";
import { textPosition } from "../definitions/modes";

export const TextWithIconSettingsSchema = Joi.object({
  iconWidthMultiplier: Joi.number().min(0).max(1).default(0.35).required(),
}).meta({
  className: "TextWithIconSettings",
});

export const TextSettingsSchema = Joi.object({
  font: Joi.string()
    .valid(fontSmaller, fontSmall, fontMedium, fontLarge)
    .default(fontMedium)
    .required(),
  text: Joi.string().allow("").default(""),
  position: Joi.number()
    .valid(textPosition.bottom, textPosition.right)
    .default(textPosition.right)
    .required(),
}).meta({
  className: "TextSettings",
});

export const ImageSettingsSchema = Joi.object({
  blackThreshold: Joi.number().default(192).required(),
  whiteThreshold: Joi.number().default(64).required(),
  brightness: Joi.number().default(0).required(),
  contrast: Joi.number().default(0).required(),
  dither: Joi.bool().default(false).required(),
  invert: Joi.bool().default(false).required(),
}).meta({
  className: "ImageSettings",
});

export const DisplaySchema = Joi.object({
  // @ts-ignore
  convertedImage: Joi.any(),
  imageSettings: ImageSettingsSchema.required(),
  isGeneratedFromDefaultBackImage: Joi.bool().required(),
  // @ts-ignore
  originalImage: Joi.any(),
  previewImage: Joi.string().required(),
  textSettings: TextSettingsSchema.required(),
  textWithIconSettings: TextWithIconSettingsSchema.required(),
}).meta({
  className: "Display",
});
