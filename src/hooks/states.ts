import { useState } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../App";
import { getStockBackDisplay } from "../lib/defaultBackImage";

export const useHeight = function () {
  return useState<number>(2);
};
export const useShowSettings = function () {
  return useState<boolean>(false);
};
export const useWidth = function () {
  return useState<number>(3);
};
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
export const useDefaultBackDisplay = function () {
  return useState<IDefaultBackDisplay>(getStockBackDisplay());
};
