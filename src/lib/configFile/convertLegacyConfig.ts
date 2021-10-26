import {
  createDefaultDisplay,
  createDefaultDisplayButton,
} from "../../definitions/defaultPage";
import { IDisplaySettings, IPage } from "../../interfaces";
import { ConfigState } from "../../states/configState";
import { getBase64Image } from "../image/base64Encode";
import { generateAdditionalImagery } from "./parseConfig";

interface LegacyDisplay
  extends Omit<IDisplaySettings, "previewImage" | "convertedImage"> {
  hasOriginalImage: boolean;
}
type LegacyDSP = LegacyDisplay[];
export const convertLegacyConfig = async (
  rawConfig: any,
  configBuffer: Buffer
): Promise<ConfigState> => {
  const pages: IPage[] = await Promise.all(
    (rawConfig.displaySettingsPages as LegacyDSP[]).map(
      async (dsp, pageIndex): Promise<IPage> => {
        let page: IPage = [];
        for (let dpIndex = 0; dpIndex < dsp.length; dpIndex++) {
          const display = dsp[dpIndex];

          let displayButton = await createDefaultDisplayButton({
            imageSettings: display.imageSettings,
            isGeneratedFromDefaultBackImage:
              display.isGeneratedFromDefaultBackImage,
            textSettings: display.textSettings,
            textWithIconSettings: display.textWithIconSettings,
            previousDisplay: display.previousDisplay,
            previousPage: display.previousPage,
            originalImage:
              rawConfig.originalImagePages[pageIndex][dpIndex] &&
              Buffer.from(rawConfig.originalImagePages[pageIndex][dpIndex]),
          });

          displayButton.display = await generateAdditionalImagery(
            displayButton.display
          );

          displayButton.button =
            rawConfig.buttonSettingsPages[pageIndex][dpIndex];
          page.push(displayButton);
        }
        return page;
      }
    )
  );
  const originalImage = Buffer.from(rawConfig.defaultBackDisplay.image);
  const temp: ConfigState = {
    brightness: rawConfig.brightness || 128,
    screenSaverTimeout: 0,
    configVersion: "1.1.0",
    width: configBuffer.readUInt8(0),
    height: configBuffer.readUInt8(1),
    pages,
    defaultBackDisplay: createDefaultDisplay({
      originalImage,
      imageSettings: {
        ...rawConfig.defaultBackDisplay.settings,
        invert: !rawConfig.defaultBackDisplay.settings.invert,
      },
      textSettings: rawConfig.defaultBackDisplay.textSettings,
      textWithIconSettings: rawConfig.defaultBackDisplay.textWithIconSettings,
    }),
  };
  temp.defaultBackDisplay.convertedImage = temp.defaultBackDisplay.originalImage
    ? await (
        await import("../image/composeImage")
      ).composeImage(temp.defaultBackDisplay)
    : await (
        await import("../image/composeImage")
      ).composeText(temp.defaultBackDisplay);
  temp.defaultBackDisplay.previewImage = getBase64Image(
    temp.defaultBackDisplay.convertedImage
  );
  return temp;
};
