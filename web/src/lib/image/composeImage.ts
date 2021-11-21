import fs from "floyd-steinberg";

import { IDisplaySettings, textPosition } from "../../interfaces";
import { colorBitmapToMonochromeBitmap } from "./colorToMonoBitmap";

export const composeImage = async (
  display: IDisplaySettings
): Promise<Buffer> => {
  const { imageSettings, textWithIconSettings, textSettings, originalImage } =
    display;
  if (!originalImage) throw new Error("no original image");
  let jimpImage: any;
  try {
    jimpImage = await import("jimp").then((jimp) =>
      jimp.default.read(originalImage)
    );
  } catch {
    console.log("image is corrupted");
    jimpImage = await import("jimp").then((jimp) =>
      jimp.default.create(128, 64, "black")
    );
  }
  const ditherBackground = await import("jimp").then((jimp) =>
    jimp.default.create(jimpImage.getWidth(), jimpImage.getHeight(), "black")
  );
  if (imageSettings.invert) ditherBackground.invert();
  jimpImage = await ditherBackground.composite(jimpImage, 0, 0);
  if (imageSettings.dither) {
    const brightnessMultiplier = imageSettings.invert ? -0.4 : 0.4;
    await jimpImage.contrast(
      imageSettings.contrast * brightnessMultiplier * -1
    );
    await jimpImage.brightness(imageSettings.brightness * brightnessMultiplier);
    jimpImage.bitmap = fs(jimpImage.bitmap);
  } else {
    // @ts-ignore
    await jimpImage.threshold({
      max: imageSettings.whiteThreshold,
      replace: imageSettings.blackThreshold,
      autoGreyscale: false,
    });
  }
  if (imageSettings.invert) jimpImage.invert();
  await jimpImage.autocrop();

  const background = await import("jimp").then(
    (jimp) => new jimp.default(128, 64, "black")
  );

  if (textSettings.text.length) {
    const font = await import("jimp").then((jimp) =>
      jimp.default.loadFont(textSettings.font)
    );
    const fontSize = font.common.lineHeight - 2;
    let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
    if (textSettings.position === textPosition.right) {
      jimpImage.scaleToFit(128 * textWithIconSettings.iconWidthMultiplier, 64);
    } else {
      jimpImage.scaleToFit(128, 64 - fontSize * lines.length);
    }
    const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
    const offset = (64 - overAllLineHeight) / 2;
    await Promise.all(
      lines.map(async (line, index) => {
        if (textSettings.position === textPosition.bottom) {
          await background.print(
            font,
            (128 - (fontSize / 2) * line.length) / 2,
            64 - fontSize * (lines.length - index),
            line
          );
        } else {
          const lineOffset = offset + fontSize * index;
          const xOffset = jimpImage.getWidth() + 1;
          await background.print(
            font,
            (128 - xOffset - (fontSize / 2) * line.length) / 2 + xOffset,
            lineOffset,
            line
          );
        }
      })
    );
    if (textSettings.position === textPosition.bottom) {
      background.composite(jimpImage, 128 / 2 - jimpImage.getWidth() / 2, 0);
    } else {
      background.composite(jimpImage, 0, 64 / 2 - jimpImage.getHeight() / 2);
    }
  } else {
    jimpImage.scaleToFit(128, 64);
    background.composite(
      jimpImage,
      128 / 2 - jimpImage.getWidth() / 2,
      64 / 2 - jimpImage.getHeight() / 2
    );
  }
  const bitmapBuffer = await background.getBufferAsync("image/bmp");
  return await colorBitmapToMonochromeBitmap(bitmapBuffer, 128, 64);
};

export const composeText = async (
  settings: IDisplaySettings
): Promise<Buffer> => {
  const { textSettings } = settings;
  const image = await import("jimp").then((jimp) =>
    jimp.default.create(128, 64, "black")
  );
  const font = await import("jimp").then((jimp) =>
    jimp.default.loadFont(textSettings.font)
  );
  const fontSize = font.common.lineHeight - 2;
  let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
  const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
  const offset = (64 - overAllLineHeight) / 2;
  await Promise.all(
    lines.map(async (line, index) => {
      const lineOffset = offset + fontSize * index;
      await image.print(
        font,
        (128 - (line.length * fontSize) / 2) / 2,
        lineOffset,
        line
      );
    })
  );
  const background = await import("jimp").then((jimp) =>
    jimp.default.create(128, 64, "black")
  );
  background.composite(
    image,
    (128 - image.getWidth()) / 2,
    (64 - image.getHeight()) / 2
  );
  const bitmapBuffer = await background.getBufferAsync("image/bmp");
  return await colorBitmapToMonochromeBitmap(bitmapBuffer, 128, 64);
};

const workaround = {
  composeText,
  composeImage,
};

export default workaround;
