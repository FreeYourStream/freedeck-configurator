import { useState } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../interfaces";
import { getStockBackDisplay } from "../definitions/defaultBackImage";
import { FDSerialAPI } from "../lib/fdSerialApi";

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
