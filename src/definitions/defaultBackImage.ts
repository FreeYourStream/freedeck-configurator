import Jimp from "jimp";

import { IDefaultBackDisplay } from "../App";
import * as backImage from "../definitions/back.png";
import { getDefaultDisplay } from "../definitions/defaultPage";
import { getEmptyConvertedImage } from "../definitions/emptyConvertedImage";

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
    Jimp.read(backImage.default).then((image) => {
      const mime = image.getMIME();
      const newMime = mime === "image/jpeg" ? mime : "image/gif";
      console.log(mime, newMime);
      image
        .quality(70)
        .scaleToFit(256, 128, "")
        .getBuffer("image/gif", async (error, buffer) =>
          setDefaultBackImage(getStockBackDisplay(await buffer))
        );
    });
  } else {
    const buffer = Buffer.from(JSON.parse(localDefaultBackImage).data);
    const settings = JSON.parse(localDefaultBackImageSettings);
    setDefaultBackImage({ settings, image: buffer });
  }
};

export const getStockBackDisplay = (image?: Buffer) => ({
  image: image ?? getEmptyConvertedImage(),
  settings: getDefaultDisplay({
    imageSettings: { invert: true },
    isGeneratedFromDefaultBackImage: true,
  }),
});
