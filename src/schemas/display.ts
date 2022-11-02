import Joi from "joi";

import { getEmptyConvertedImage } from "../definitions/emptyConvertedImage";
import {
  fontLarge,
  fontMedium,
  fontSmall,
  fontSmaller,
} from "../definitions/fonts";
import { EImageMode, ETextPosition } from "../definitions/modes";
import { getBase64Image } from "../lib/image/base64Encode";

export const TextWithIconSettingsSchema = Joi.object({
  iconWidthMultiplier: Joi.number().min(0).max(1).failover(0.35).required(),
}).meta({
  className: "TextWithIconSettings",
});

export const TextSettingsSchema = Joi.object({
  font: Joi.string()
    .valid(fontSmaller, fontSmall, fontMedium, fontLarge)
    .failover(fontMedium)
    .required(),
  text: Joi.string().allow(""),
  position: Joi.number()
    .valid(ETextPosition.bottom, ETextPosition.right)
    .failover(ETextPosition.bottom)
    .required(),
}).meta({
  className: "TextSettings",
});

export const ImageSettingsSchema = Joi.object({
  blackThreshold: Joi.number().failover(192).required(),
  whiteThreshold: Joi.number().failover(64).required(),
  brightness: Joi.number().failover(0).required(),
  contrast: Joi.number().failover(0).required(),
  autoCrop: Joi.bool().failover(true).required(),
  imageMode: Joi.valid(EImageMode.dither, EImageMode.normal, EImageMode.hybrid)
    .failover(EImageMode.normal)
    .required(),
  invert: Joi.bool().failover(false).required(),
}).meta({
  className: "ImageSettings",
});

export const DisplaySchema = Joi.object({
  // @ts-ignore
  convertedImage: Joi.any(),
  imageSettings: ImageSettingsSchema.required().failover(ImageSettingsSchema),
  isGeneratedFromDefaultBackImage: Joi.bool().required().failover(false),
  // @ts-ignore
  originalImage: Joi.any(),
  previewImage: Joi.string()
    .required()
    .failover(getBase64Image(getEmptyConvertedImage())),
  textSettings: TextSettingsSchema.required().failover(TextSettingsSchema),
  textWithIconSettings: TextWithIconSettingsSchema.required().failover(
    TextWithIconSettingsSchema
  ),
}).meta({
  className: "Display",
});
