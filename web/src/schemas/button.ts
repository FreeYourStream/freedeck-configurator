import Joi from "joi";

import { EAction } from "../definitions/modes";
import { FDSettings, IButtonSetting, IButtonSettings } from "../interfaces";

export const ButtonValuesSchema = Joi.object<IButtonSetting["values"]>({
  [EAction.changePage]: Joi.string().default(""),
  [EAction.hotkeys]: Joi.array().items(Joi.number()).default([]),
  [EAction.settings]: Joi.object({
    setting: Joi.number()
      .valid(FDSettings.absolute_brightness, FDSettings.change_brightness)
      .default(FDSettings.change_brightness),
    value: Joi.number().default(128),
  }).default(),
  [EAction.special_keys]: Joi.number().default(0),
  [EAction.text]: Joi.array().items(Joi.number()).default([]),
}).meta({
  className: "ButtonValues",
});

export const ButtonSettingSchema = Joi.object<IButtonSetting>({
  mode: Joi.string()
    .valid(
      EAction.changePage,
      EAction.hotkeys,
      EAction.noop,
      EAction.settings,
      EAction.special_keys,
      EAction.text
    )
    .default(EAction.noop),
  values: ButtonValuesSchema.required(),
}).meta({
  className: "ButtonSetting",
});

export const ButtonSchema = Joi.object<IButtonSettings>({
  primary: ButtonSettingSchema.required(),
  secondary: ButtonSettingSchema.required(),
}).meta({ className: "Button" });
