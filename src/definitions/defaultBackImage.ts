import backImage from "../definitions/back.png";
import { createDefaultDisplay } from "../definitions/defaultPage";
import { Display } from "../generated";
import { generateAdditionalImagery } from "../lib/configFile/parseConfig";
import { stringToImage } from "../lib/file/fileToImage";

export const createDefaultBackDisplay = async function (
  previousPage?: string
): Promise<Display> {
  const localDefaultBackDisplay = JSON.parse(
    localStorage.getItem("defaultBackDisplay") || "{}"
  );
  let display: Display = createDefaultDisplay();
  if (Object.keys(localDefaultBackDisplay).length && previousPage !== "dbd") {
    localDefaultBackDisplay.convertedImage = Buffer.from(
      localDefaultBackDisplay.convertedImage
    );
    localDefaultBackDisplay.originalImage = Buffer.from(
      localDefaultBackDisplay.originalImage
    );
    display = localDefaultBackDisplay;
  } else {
    display = {
      ...display,
      imageSettings: {
        ...display.imageSettings,
        invert: true,
      },
      originalImage: await stringToImage(backImage),
      isGeneratedFromDefaultBackImage: true,
    };
  }
  display = await generateAdditionalImagery(display);
  return display;
};
