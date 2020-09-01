import { useState } from "react";

import { IDefaultBackDisplay } from "../App";
import { getDefaultDisplay } from "../definitions/defaultPage";

export const getStockBackDisplay = (image?: Buffer) => ({
  image: image ?? new Buffer(1024),
  settings: getDefaultDisplay({
    imageSettings: { invert: true },
    isGeneratedFromDefaultBackImage: true,
  }),
});
export const useDefaultBackDisplay = function () {
  return useState<IDefaultBackDisplay>(getStockBackDisplay());
};
