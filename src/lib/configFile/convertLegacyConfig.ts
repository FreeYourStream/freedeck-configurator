import { createDefaultDisplay } from "../../definitions/defaultPage";
import { IDisplay, IDisplaySettingsPage } from "../../interfaces";
import { ConfigState } from "../../states/configState";
import { getBase64Image } from "../image/base64Encode";
import { composeImage, composeText } from "../image/composeImage";

interface LegacyDisplay
  extends Omit<IDisplay, "previewImage" | "convertedImage"> {
  hasOriginalImage: boolean;
}
type LegacyDSP = LegacyDisplay[];
export const convertLegacyConfig = async (
  rawConfig: any,
  configBuffer: Buffer
): Promise<ConfigState> => {
  const displaySettingsPages: IDisplaySettingsPage[] = await Promise.all(
    (rawConfig.displaySettingsPages as LegacyDSP[]).map(
      (dsp, pageIndex): Promise<IDisplaySettingsPage> =>
        Promise.all(
          dsp.map(async (display, displayIndex): Promise<IDisplay> => {
            console.log(display.isGeneratedFromDefaultBackImage);
            let temp = {
              imageSettings: display.imageSettings,
              isGeneratedFromDefaultBackImage:
                display.isGeneratedFromDefaultBackImage,
              textSettings: display.textSettings,
              textWithIconSettings: display.textWithIconSettings,
              previousDisplay: display.previousDisplay,
              previousPage: display.previousPage,
              originalImage:
                rawConfig.originalImagePages[pageIndex][displayIndex] &&
                Buffer.from(
                  rawConfig.originalImagePages[pageIndex][displayIndex]
                ),
            };
            (temp as any).convertedImage = temp.originalImage
              ? await composeImage(temp as unknown as IDisplay)
              : await composeText(temp as unknown as IDisplay);
            (temp as any).previewImage = getBase64Image(
              (temp as any).convertedImage
            );
            return temp as unknown as IDisplay;
          })
        )
    )
  );
  const originalImage = Buffer.from(rawConfig.defaultBackDisplay.image);
  console.log("ORIGINAL image", originalImage);
  const temp: ConfigState = {
    brightness: rawConfig.brightness || 128,
    configVersion: "1.1.0",
    width: configBuffer.readUInt8(0),
    height: configBuffer.readUInt8(1),
    buttonSettingsPages: rawConfig.buttonSettingsPages,
    defaultBackDisplay: createDefaultDisplay({
      originalImage,
      imageSettings: {
        ...rawConfig.defaultBackDisplay.settings,
        invert: !rawConfig.defaultBackDisplay.settings.invert,
      },
      textSettings: rawConfig.defaultBackDisplay.textSettings,
      textWithIconSettings: rawConfig.defaultBackDisplay.textWithIconSettings,
    }),
    displaySettingsPages,
  };
  temp.defaultBackDisplay.convertedImage = temp.defaultBackDisplay.originalImage
    ? await composeImage(temp.defaultBackDisplay)
    : await composeText(temp.defaultBackDisplay);
  temp.defaultBackDisplay.previewImage = getBase64Image(
    temp.defaultBackDisplay.convertedImage
  );
  return temp;
};
