import Jimp from "jimp";

import { IDefaultBackDisplay } from "../App";
import * as backImage from "../definitions/back.png";
import { getDefaultDisplay } from "../definitions/defaultPage";

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

export const getStockBackDisplay = (image?: Buffer) => ({
  image: image ?? new Buffer(1024),
  settings: getDefaultDisplay({
    imageSettings: { invert: true },
    isGeneratedFromDefaultBackImage: true,
  }),
});
