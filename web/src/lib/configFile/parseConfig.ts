import { createDefaultDisplay } from "../../definitions/defaultPage";
import { Display } from "../../generated";
import { ConfigSchema } from "../../schemas/config";
import { ConfigState } from "../../states/configState";
import { getBase64Image } from "../image/base64Encode";
import { composeImage, composeText } from "../image/composeImage";

export const generateAdditionalImagery = async (
  display: Display
): Promise<Display> => {
  const newDisplay = {
    ...createDefaultDisplay(),
    imageSettings: display.imageSettings,
    isGeneratedFromDefaultBackImage: display.isGeneratedFromDefaultBackImage,
    textSettings: display.textSettings,
    textWithIconSettings: display.textWithIconSettings,
    originalImage:
      display.originalImage && Buffer.from(display.originalImage as any),
  };

  newDisplay.convertedImage = newDisplay.originalImage
    ? await composeImage(newDisplay)
    : await composeText(newDisplay);
  newDisplay.previewImage = getBase64Image(newDisplay.convertedImage);
  return newDisplay;
};

export const convertCurrentConfig = async (
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
  const validated = ConfigSchema.validate({
    ...rawConfig,
    defaultBackDisplay: await generateAdditionalImagery(
      rawConfig.defaultBackDisplay
    ),
  });
  if (validated.error) throw new Error(validated.error.message);
  return validated.value;
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
