import Joi from "joi";

import { EAction, FDSettings } from "../definitions/modes";

export const ButtonValuesSchema = Joi.object({
  [EAction.changePage]: Joi.string().allow(""),
  [EAction.hotkeys]: Joi.array().items(Joi.number()).failover([]).required(),
  [EAction.settings]: Joi.object({
    setting: Joi.number()
      .valid(FDSettings.absolute_brightness, FDSettings.change_brightness)
      .failover(FDSettings.change_brightness)
      .required(),
    value: Joi.number().failover(128).required(),
  }).required(),
  [EAction.special_keys]: Joi.number().failover(0).required(),
  [EAction.text]: Joi.array().items(Joi.number()).failover([]).required(),
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
    .failover(EAction.noop)
    .strict()
    .required(),
  values: ButtonValuesSchema.required(),
}).meta({
  className: "ButtonSetting",
});

export const ButtonSchema = Joi.object({
  primary: ButtonSettingSchema.required(),
  secondary: ButtonSettingSchema.required(),
  leavePage: Joi.object({
    enabled: Joi.boolean().failover(false).required(),
    pageId: Joi.string(),
  }).required(),
}).meta({ className: "Button" });
