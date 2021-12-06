import Joi from "joi";

import { ButtonSchema } from "./button";
import { DisplaySchema } from "./display";

export const DisplayButtonSchema = Joi.object({
  button: ButtonSchema.required(),
  display: DisplaySchema.required(),
}).meta({ className: "DisplayButton" });

export const PageSchema = Joi.object({
  name: Joi.string(),
  windowName: Joi.string(),
  isStartPage: Joi.bool().default(false).required(),
  isInCollection: Joi.string(),
  usePageNameAsWindowName: Joi.bool().default(true).required(),
  displayButtons: Joi.array().items(DisplayButtonSchema).required(),
}).meta({ className: "Page" });

export interface PagesById {
  // @ts-ignore
  [x: string]: Page;
}

export const PagesSchema = Joi.object({
  byId: Joi.object()
    .custom((valueeee, helper) => {
      let validated: any = {};
      let error: any;
      Object.entries(valueeee).forEach(([key, value]) => {
        const result = PageSchema.validate(value);
        validated[key] = result.value;
        if (result.error) throw new Error(result.error.message);
      });
      if (error) {
      }
      return validated;
    })
    .meta({ className: "Record<string,Page>" })
    .required(),
  sorted: Joi.array().items(Joi.string()).default([]).required(),
}).meta({ className: "Pages" });

export const CollectionSchema = Joi.object({
  name: Joi.string(),
  pages: Joi.array().items(Joi.string()).default([]).required(),
  windowName: Joi.string(),
  usePageNameAsWindowName: Joi.bool().default(true).required(),
}).meta({ className: "Collection" });

export const CollectionsSchema = Joi.object({
  byId: Joi.object()
    .unknown(true)
    .meta({ unknownType: "Collection" })
    .default({})
    .required(),
  sorted: Joi.array().items(Joi.string()).default([]).required(),
}).meta({ className: "Collections" });

export const ConfigSchema = Joi.object({
  pages: PagesSchema.required(),
  brightness: Joi.number().default(128).required(),
  height: Joi.number().max(16).min(1).default(2).required(),
  width: Joi.number().max(16).min(1).default(3).required(),
  configVersion: Joi.string().default("1.1.0").required(),
  screenSaverTimeout: Joi.number().min(0).default(0).required(),
  collections: CollectionsSchema.required(),
  defaultBackDisplay: DisplaySchema.required(),
})
  .meta({ className: "Config" })
  .strict(true);
