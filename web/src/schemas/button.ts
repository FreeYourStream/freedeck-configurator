import Joi from "joi";

import { EAction, FDSettings } from "../definitions/modes";

export const ButtonValuesSchema = Joi.object({
  [EAction.changePage]: Joi.string().default("").allow("").required(),
  [EAction.hotkeys]: Joi.array().items(Joi.number()).default([]).required(),
  [EAction.settings]: Joi.object({
    setting: Joi.number()
      .valid(FDSettings.absolute_brightness, FDSettings.change_brightness)
      .default(FDSettings.change_brightness)
      .required(),
    value: Joi.number().default(128).required(),
  })
    .default()
    .required(),
  [EAction.special_keys]: Joi.number().default(0).required(),
  [EAction.text]: Joi.array().items(Joi.number()).default([]).required(),
}).meta({
  className: "ButtonValues",
});

export const ButtonSettingSchema = Joi.object({
  mode: Joi.string()
    .valid(
      EAction.changePage,
      EAction.hotkeys,
      EAction.noop,
      EAction.settings,
      EAction.special_keys,
      EAction.text
    )
    .default(EAction.noop)
    .strict()
    .required(),
  values: ButtonValuesSchema.required(),
}).meta({
  className: "ButtonSetting",
});

export const ButtonSchema = Joi.object({
  primary: ButtonSettingSchema.required(),
  secondary: ButtonSettingSchema.required(),
}).meta({ className: "Button" });
