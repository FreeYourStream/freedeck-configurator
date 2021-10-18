import backImage from "../definitions/back.png";
import {
  createDefaultDisplay,
  IDisplayOptions,
} from "../definitions/defaultPage";
import { IDisplay } from "../interfaces";
import { stringToImage } from "../lib/fileToImage";
import { getBase64Image } from "../lib/image/base64Encode";
import { composeImage } from "../lib/image/composeImage";

export const createDefaultBackDisplay = async function (
  previousPage?: number,
  previousDisplay?: number
): Promise<IDisplay> {
  const localDefaultBackDisplay = JSON.parse(
    localStorage.getItem("defaultBackDisplay") || "{}"
  );
  let displayOptions: IDisplayOptions;
  if (Object.keys(localDefaultBackDisplay).length && previousPage !== -1) {
    localDefaultBackDisplay.convertedImage = Buffer.from(
      localDefaultBackDisplay.convertedImage
    );
    localDefaultBackDisplay.originalImage = Buffer.from(
      localDefaultBackDisplay.originalImage
    );
    displayOptions = localDefaultBackDisplay;
  } else {
    displayOptions = {
      originalImage: await stringToImage(backImage),
      imageSettings: { invert: true },
      isGeneratedFromDefaultBackImage: true,
    };
  }
  const display: IDisplay = createDefaultDisplay({
    ...displayOptions,
    previousDisplay,
    previousPage,
  });
  display.convertedImage = await composeImage(display);
  display.previewImage = getBase64Image(display.convertedImage);
  return display;
};
