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
  [EAction.text]: Joi.string().allow("").failover(" "),
}).meta({
  className: "ButtonValues",
});

export const LeavePageSchema = Joi.object({
  enabled: Joi.boolean().failover(false).required(),
  pageId: Joi.string(),
}).meta({ className: "LeavePage" });

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
  values: ButtonValuesSchema.required().failover(ButtonValuesSchema),
  leavePage: LeavePageSchema.required().failover(LeavePageSchema),
}).meta({
  className: "ButtonSetting",
});

export const ButtonSchema = Joi.object({
  primary: ButtonSettingSchema.required().failover(ButtonSettingSchema),
  secondary: ButtonSettingSchema.required().failover(ButtonSettingSchema),
}).meta({ className: "Button" });
