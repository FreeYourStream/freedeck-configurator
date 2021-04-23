import { useState } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../App";
import { getStockBackDisplay } from "../definitions/defaultBackImage";
import { FDSerialAPI } from "../lib/fdSerialApi";

export const useBrightness = function () {
  return useState<number>(128);
};
export const useHeight = function () {
  return useState<number>(2);
};
export const useWidth = function () {
  return useState<number>(3);
};
export const useShowSettings = function () {
  return useState<boolean>(false);
};
export const useShowLogin = () => useState<boolean>(false);
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
export const useSerialConnectedStatus = function () {
  return useState<boolean>(false);
};
