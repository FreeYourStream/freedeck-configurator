import Jimp from "jimp";

import { IDefaultBackImage } from "../App";
import * as backImage from "../definitions/back.png";

export const loadDefaultBackImage = function (
  defaultBackImage: IDefaultBackImage,
  setDefaultBackImage: React.Dispatch<React.SetStateAction<IDefaultBackImage>>
) {
  const localDefaultBackImage = localStorage.getItem("defaultBackImage");
  const localDefaultBackImageSettings = localStorage.getItem(
    "defaultBackImageSettings"
  );
  if (!localDefaultBackImage || !localDefaultBackImageSettings) {
    console.log("using stock image");
    Jimp.read(backImage.default).then((image) =>
      image.getBuffer("image/bmp", (error, buffer) =>
        setDefaultBackImage({ ...defaultBackImage, image: buffer })
      )
    );
  } else {
    const buffer = Buffer.from(JSON.parse(localDefaultBackImage).data);
    const settings = JSON.parse(localDefaultBackImageSettings);
    setDefaultBackImage({ settings, image: buffer });
  }
};
