import { createDefaultDisplay } from "../../definitions/defaultPage";
import { IDisplaySettings } from "../../interfaces";
import { ConfigState } from "../../states/configState";
import { getBase64Image } from "../image/base64Encode";
import { composeImage, composeText } from "../image/composeImage";

export const generateAdditionalImagery = async (
  display: IDisplaySettings
): Promise<IDisplaySettings> => {
  display = createDefaultDisplay({
    imageSettings: display.imageSettings,
    isGeneratedFromDefaultBackImage: display.isGeneratedFromDefaultBackImage,
    textSettings: display.textSettings,
    textWithIconSettings: display.textWithIconSettings,
    previousDisplay: display.previousDisplay,
    previousPage: display.previousPage,
    originalImage:
      display.originalImage && Buffer.from(display.originalImage as any),
  });
  display.convertedImage = display.originalImage
    ? await composeImage(display)
    : await composeText(display);
  display.previewImage = getBase64Image(display.convertedImage);
  return display;
};

const convertCurrentConfig = async (
  rawConfig: ConfigState
): Promise<ConfigState> => {
  for (let outer = 0; outer < rawConfig.pages.sorted.length; outer++) {
    const id = rawConfig.pages.sorted[outer];
    const page = rawConfig.pages.byId[id];

    for (let inner = 0; inner < page.displayButtons.length; inner++) {
      page.displayButtons[inner].display = await generateAdditionalImagery(
        page.displayButtons[inner].display
      );
    }
  }
  return {
    ...rawConfig,
    defaultBackDisplay: await generateAdditionalImagery(
      rawConfig.defaultBackDisplay
    ),
  };
};

export const parseConfig = async (
  configBuffer: Buffer
): Promise<ConfigState> => {
  const displayButtonCount = configBuffer.readUInt16LE(2) - 1; // subtract 1 for the header row
  const imageOffset = 16 * (displayButtonCount + 1);
  const jsonOffset = imageOffset + 1024 * displayButtonCount;

  if (configBuffer.length === jsonOffset) {
    alert("config too old. not compatible yet. please create a new one");
    throw new Error(
      "config too old. not compatible (yet). please create a new one"
    );
  }
  const jsonConfigSlice = configBuffer.slice(jsonOffset);
  const rawConfig = JSON.parse(jsonConfigSlice.toString());
  if (!rawConfig.configVersion) {
    throw new Error("legacy config. not compatible");
  }
  return await convertCurrentConfig(rawConfig);
};
