import Joi from "joi";

import { ButtonSchema } from "./button";
import { DisplaySchema } from "./display";

export const DisplayButtonSchema = Joi.object({
  button: ButtonSchema.required(),
  display: DisplaySchema.required(),
}).meta({ className: "DisplayButton" });

export const PublishData = Joi.object({
  createdBy: Joi.string().required(),
  forkedFrom: Joi.string(),
});

export const PageSchema = Joi.object({
  name: Joi.string().allow(""),
  windowName: Joi.string().allow(""),
  publishData: PublishData,
  isInCollection: Joi.string(),
  usePageNameAsWindowName: Joi.bool().failover(true).required(),
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
        const result = PageSchema.validate(value, { stripUnknown: true });
        validated[key] = result.value;
        if (result.error) throw new Error(result.error.message);
      });
      if (error) {
      }
      return validated;
    })
    .meta({ className: "Record<string,Page>" })
    .failover({})
    .required(),
  sorted: Joi.array().items(Joi.string()).failover([]).required(),
}).meta({ className: "Pages" });

export const CollectionSchema = Joi.object({
  name: Joi.string(),
  pages: Joi.array().items(Joi.string()).failover([]).required(),
  windowName: Joi.string(),
  usePageNameAsWindowName: Joi.bool().failover(true).required(),
}).meta({ className: "Collection" });

export const CollectionsSchema = Joi.object({
  byId: Joi.object()
    .unknown(true)
    .meta({ unknownType: "Collection" })
    .failover({})
    .required(),
  sorted: Joi.array().items(Joi.string()).failover([]).required(),
}).meta({ className: "Collections" });

export const ConfigSchema = Joi.object({
  pages: PagesSchema.required(),
  brightness: Joi.number().failover(128).required(),
  height: Joi.number().max(16).min(1).failover(2).required(),
  width: Joi.number().max(16).min(1).failover(3).required(),
  configVersion: Joi.string().failover("1.1.0").required(),
  screenSaverTimeout: Joi.number().min(0).failover(0).required(),
  collections: CollectionsSchema.required(),
  defaultBackDisplay: DisplaySchema.required(),
})
  .meta({ className: "Config" })
  .strict(true);
