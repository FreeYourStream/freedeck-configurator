import { useState } from "react";

import {
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplaySettingsPage,
  IOriginalImagePage,
} from "../interfaces";
import { getStockBackDisplay } from "../definitions/defaultBackImage";

export const useShowSettings = function () {
  return useState<boolean>(false);
};
export const useShowLogin = () => useState<boolean>(false);

export const useDisplaySettingsPages = function () {
  return useState<IDisplaySettingsPage[]>([]);
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
