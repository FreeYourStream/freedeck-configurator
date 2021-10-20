import backImage from "../definitions/back.png";
import {
  createDefaultDisplay,
  IDisplayOptions,
} from "../definitions/defaultPage";
import { IDisplaySettings } from "../interfaces";
import { generateAdditionalImagery } from "../lib/configFile/parseConfig";
import { stringToImage } from "../lib/fileToImage";

export const createDefaultBackDisplay = async function (
  previousPage?: number,
  previousDisplay?: number
): Promise<IDisplaySettings> {
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
  let display: IDisplaySettings = createDefaultDisplay({
    ...displayOptions,
    previousDisplay,
    previousPage,
  });
  display = await generateAdditionalImagery(display);
  return display;
};
