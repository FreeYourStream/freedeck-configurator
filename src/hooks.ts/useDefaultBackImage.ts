import { useState } from "react";

import { IDefaultBackImage } from "../App";
import { getDefaultDisplay } from "../definitions/defaultPage";

export const useDefaultBackImage = function () {
  return useState<IDefaultBackImage>({
    image: new Buffer(1024),
    settings: getDefaultDisplay({ imageSettings: { invert: true } }),
  });
};
