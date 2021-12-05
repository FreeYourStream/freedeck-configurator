import Joi from "joi";

import { EAction } from "../definitions/modes";
import {
  FDSettings,
  IButtonSetting,
  IButtonSettings,
  ICollection,
  ICollections,
  IDisplayButton,
  IDisplaySettings,
  IPage,
  IPages,
} from "../interfaces";
import { ConfigState } from "../states/configState";
import { ButtonSchema } from "./button";
import { DisplaySchema } from "./display";

export const DisplayButtonSchema = Joi.object<IDisplayButton>({
  button: ButtonSchema,
  display: DisplaySchema,
}).meta({ className: "DisplayButton" });

export const DisplayButtonsSchema = Joi.array()
  .items(DisplayButtonSchema)
  .meta({ className: "DisplayButtons" });

export const PageSchema = Joi.object<IPage>({
  name: Joi.string(),
  windowName: Joi.string(),
  isStartPage: Joi.bool().default(false),
  isInCollection: Joi.string(),
  usePageNameAsWindowName: Joi.bool().default(true),
  displayButtons: DisplayButtonsSchema.required(),
}).meta({ className: "Page" });

export const PagesSchema = Joi.object<IPages>({
  byId: Joi.object().unknown(true).meta({ unknownType: "Page" }).default({}),
  sorted: Joi.array().items(Joi.string()).default([]),
}).meta({ className: "Pages" });

export const CollectionSchema = Joi.object<ICollection>({
  name: Joi.string(),
  pages: Joi.array().items(Joi.string()).default([]),
  windowName: Joi.string(),
  usePageNameAsWindowName: Joi.bool().default(true),
}).meta({ className: "Collection" });

export const CollectionsSchema = Joi.object<ICollections>({
  byId: Joi.object()
    .unknown(true)
    .meta({ unknownType: "Collection" })
    .default({}),
  sorted: Joi.array().items(Joi.string()).default([]),
}).meta({ className: "Collections" });

export const ConfigSchema = Joi.object<ConfigState>({
  pages: PagesSchema.required(),
  brightness: Joi.number().default(128),
  height: Joi.number().max(16).min(1).default(2),
  width: Joi.number().max(16).min(1).default(3),
  configVersion: Joi.string().default("1.1.0").required(),
  screenSaverTimeout: Joi.number().min(0).default(0),
  collections: CollectionsSchema.required(),
  defaultBackDisplay: DisplaySchema,
}).meta({ className: "Config" });
