import { createDefaultDisplay } from "../../definitions/defaultPage";
import { IDisplay, IDisplaySettingsPage } from "../../interfaces";
import { ConfigState } from "../../states/configState";
import { getBase64Image } from "../image/base64Encode";
import { composeImage, composeText } from "../image/composeImage";
import { convertLegacyConfig } from "./convertLegacyConfig";

const generateAdditionalImagery = async (display: IDisplay) => {
  const temp = createDefaultDisplay({
    imageSettings: display.imageSettings,
    isGeneratedFromDefaultBackImage: display.isGeneratedFromDefaultBackImage,
    textSettings: display.textSettings,
    textWithIconSettings: display.textWithIconSettings,
    previousDisplay: display.previousDisplay,
    previousPage: display.previousPage,
    originalImage:
      display.originalImage && Buffer.from(display.originalImage as any),
  });
  temp.convertedImage = temp.originalImage
    ? await composeImage(temp)
    : await composeText(temp);
  temp.previewImage = getBase64Image(temp.convertedImage);
  return temp;
};

const convertCurrentConfig = async (
  rawConfig: ConfigState
): Promise<ConfigState> => {
  const dsp = await Promise.all(
    rawConfig.displaySettingsPages.map<Promise<IDisplaySettingsPage>>(
      (dsp, pageIndex) =>
        Promise.all(
          dsp.map(async (display) => generateAdditionalImagery(display))
        )
    )
  );
  return {
    ...rawConfig,
    displaySettingsPages: dsp,
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
    return await convertLegacyConfig(rawConfig, configBuffer);
  }
  return await convertCurrentConfig(rawConfig);
};
