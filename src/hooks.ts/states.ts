import { useState } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDisplayPage,
  IOriginalImagePage,
} from "../App";

export const useActionSettingPages = function () {
  return useState<IButtonPage[]>([]);
};
export const useImageSettingPages = function () {
  return useState<IDisplayPage[]>([]);
};
export const useOriginalImagePages = function () {
  return useState<IOriginalImagePage[]>([]);
};
export const useConvertedImagePages = function () {
  return useState<IConvertedImagePage[]>([]);
};
