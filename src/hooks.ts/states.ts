import { useState } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDisplayPage,
  IOriginalImagePage,
} from "../App";

export const useButtonSettingsPages = function () {
  return useState<IButtonPage[]>([]);
};
export const useDisplaySettingsPages = function () {
  return useState<IDisplayPage[]>([]);
};
export const useOriginalImagePages = function () {
  return useState<IOriginalImagePage[]>([]);
};
export const useConvertedImagePages = function () {
  return useState<IConvertedImagePage[]>([]);
};
