import Jimp from "jimp";

import { IDefaultBackDisplay } from "../App";
import * as backImage from "../definitions/back.png";
import { getStockBackDisplay } from "../hooks.ts/useDefaultBackImage";

export const loadDefaultBackDisplay = function (
  setDefaultBackImage: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >,
  forceStock?: boolean
) {
  const localDefaultBackImage = localStorage.getItem("defaultBackImage");
  const localDefaultBackImageSettings = localStorage.getItem(
    "defaultBackImageSettings"
  );
  if (!localDefaultBackImage || !localDefaultBackImageSettings || forceStock) {
    Jimp.read(backImage.default).then((image) =>
      image.getBuffer("image/bmp", (error, buffer) =>
        setDefaultBackImage(getStockBackDisplay(buffer))
      )
    );
  } else {
    const buffer = Buffer.from(JSON.parse(localDefaultBackImage).data);
    const settings = JSON.parse(localDefaultBackImageSettings);
    setDefaultBackImage({ settings, image: buffer });
  }
};
