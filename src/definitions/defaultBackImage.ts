import {
  createDefaultDisplay,
  IDisplayOptions,
} from "../definitions/defaultPage";
import { getEmptyConvertedImage } from "../definitions/emptyConvertedImage";
import { composeImage } from "../lib/image/composeImage";
import { IDisplay } from "../interfaces";
import Jimp from "jimp";
import backImage from "../definitions/back.png";
import { fileToImage, stringToImage } from "../lib/fileToImage";

// export const createDefaultBackDisplayFuck = function (forceStock?: boolean) {
//   const localDefaultBackImage = localStorage.getItem("defaultBackImage");
//   const localDefaultBackImageSettings = localStorage.getItem(
//     "defaultBackImageSettings"
//   );
//   if (!localDefaultBackImage || !localDefaultBackImageSettings || forceStock) {
//     Jimp.read(backImage.default).then((image) => {
//       const mime = image.getMIME();
//       const newMime = mime === "image/jpeg" ? mime : "image/gif";
//       console.log(mime, newMime);
//       image
//         .quality(70)
//         .scaleToFit(256, 128, "")
//         .getBufferAsync(newMime, async (error, buffer) =>
//           setDefaultBackImage(getStockBackDisplay(await buffer))
//         );
//     });
//   } else {
//     const buffer = Buffer.from(JSON.parse(localDefaultBackImage).data);
//     const settings = JSON.parse(localDefaultBackImageSettings);
//     setDefaultBackImage({ settings, image: buffer });
//   }
// };

export const createDefaultBackDisplay = async function (
  previousPage?: number,
  previousDisplay?: number
): Promise<IDisplay> {
  const localDefaultBackDisplay = localStorage.getItem("defaultBackDisplay");
  const displayOptions: IDisplayOptions = localDefaultBackDisplay
    ? JSON.parse(localDefaultBackDisplay)
    : {
        originalImage: await stringToImage(backImage),
        imageSettings: { invert: true },
        isGeneratedFromDefaultBackImage: true,
      };
  const display: IDisplay = createDefaultDisplay({
    ...displayOptions,
    previousDisplay,
    previousPage,
  });
  display.convertedImage = await composeImage(display);
  return display;
};

export const getStockBackDisplay = (image?: Buffer) => ({
  image: image ?? getEmptyConvertedImage(),
  settings: createDefaultDisplay({
    imageSettings: { invert: true },
    isGeneratedFromDefaultBackImage: true,
  }),
});
