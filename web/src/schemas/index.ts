import Joi from "joi";

import { IPage, IPages } from "../interfaces";
import { ConfigState } from "../states/configState";

export const PageSchema = Joi.object<IPage>({
  name: Joi.string(),
}).meta({ className: "Page" });

export const PagesSchema = Joi.object<IPages>({
  byId: Joi.object().unknown(true).meta({ unknownType: "Page" }).default({}),
  sorted: Joi.array().items(Joi.string()).default([]),
})
  .required()
  .meta({ className: "Pages" });

export const ConfigSchema = Joi.object<ConfigState>({
  pages: PagesSchema,
  brightness: Joi.number().default(128),
  height: Joi.number().max(16).min(1).default(2),
  width: Joi.number().max(16).min(1).default(3),
  configVersion: Joi.string().default("1.1.0").required(),
}).meta({ className: "Config" });
