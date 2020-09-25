import fs from "floyd-steinberg";
import Jimp from "jimp";

import { IDisplay } from "../../App";
import { colorBitmapToMonochromeBitmap } from "./colorToMonoBitmap";

export interface IConverted {
  bytes: Buffer;
  base64: string;
}

export const composeImage = async (
  image: Buffer,
  width: number,
  height: number,
  settings: IDisplay
): Promise<Buffer> => {
  const { imageSettings, textWithIconSettings, textSettings } = settings;
  let jimpImage = await Jimp.read(image);
  const ditherBackground = await Jimp.create(
    jimpImage.getWidth(),
    jimpImage.getHeight(),
    "black"
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

  const background = new Jimp(width, height, "black");

  if (textWithIconSettings.enabled) {
    jimpImage.scaleToFit(
      width * textWithIconSettings.iconWidthMultiplier,
      height
    );
    const font = await Jimp.loadFont(textSettings.font);
    const fontSize = font.common.lineHeight - 2;
    let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
    const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
    const offset = (64 - overAllLineHeight) / 2;
    await Promise.all(
      lines.map(async (line, index) => {
        const lineOffset = offset + fontSize * index;
        await background.print(
          font,
          jimpImage.getWidth() + 3,
          lineOffset,
          line
        );
      })
    );
    background.composite(jimpImage, 0, height / 2 - jimpImage.getHeight() / 2);
  } else {
    jimpImage.scaleToFit(width, height);
    background.composite(
      jimpImage,
      width / 2 - jimpImage.getWidth() / 2,
      height / 2 - jimpImage.getHeight() / 2
    );
  }
  const bitmapBuffer = await background.getBufferAsync("image/bmp");
  return await colorBitmapToMonochromeBitmap(bitmapBuffer, width, height);
};

export const composeText = async (
  width: number,
  height: number,
  settings: IDisplay
): Promise<Buffer> => {
  const { textSettings } = settings;
  const image = await Jimp.create(128, 64, "black");
  const font = await Jimp.loadFont(textSettings.font);
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
  const background = await Jimp.create(128, 64, "black");
  background.composite(
    image,
    (128 - image.getWidth()) / 2,
    (64 - image.getHeight()) / 2
  );
  const bitmapBuffer = await background.getBufferAsync("image/bmp");
  return await colorBitmapToMonochromeBitmap(bitmapBuffer, width, height);
};
