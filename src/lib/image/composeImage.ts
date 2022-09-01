import fs from "floyd-steinberg";
import type Jimp from "jimp";
import debounce from "lodash/debounce";

import { EImageMode, ETextPosition } from "../../definitions/modes";
import { Display } from "../../generated";
import { colorBitmapToMonochromeBitmap } from "./colorToMonoBitmap";

export const _composeImage = async (display: Display): Promise<Buffer> => {
  const jimp = (await import("jimp")).default;
  const { imageSettings, textWithIconSettings, textSettings, originalImage } =
    display;
  if (!originalImage) throw new Error("no original image");
  let jimpImage: Jimp;
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

  if (imageSettings.imageMode === EImageMode.dither) {
    const brightnessMultiplier = imageSettings.invert ? -0.4 : 0.4;
    await jimpImage.contrast(
      imageSettings.contrast * brightnessMultiplier * -1
    );
    await jimpImage.brightness(imageSettings.brightness * brightnessMultiplier);
    jimpImage.scaleToFit(128, 64);
    jimpImage.bitmap = fs(jimpImage.bitmap);
    if (imageSettings.invert) jimpImage.invert();
  } else if (imageSettings.imageMode === EImageMode.hybrid) {
    // dither part
    const brightnessMultiplier = imageSettings.invert ? -0.4 : 0.4;
    const ditherImage = await jimp.create(jimpImage);
    await ditherImage.contrast(
      imageSettings.contrast * brightnessMultiplier * -2.5
    );
    await ditherImage.brightness(
      imageSettings.brightness * brightnessMultiplier
    );
    ditherImage.scaleToFit(128, 64);
    ditherImage.bitmap = fs(ditherImage.bitmap);
    if (imageSettings.invert) ditherImage.invert();
    // end dither part

    await jimpImage.grayscale();
    await jimpImage.scaleToFit(128, 64);
    await jimpImage.contrast(imageSettings.contrast);
    await jimpImage.brightness(imageSettings.brightness);
    const factor = 50; // imageSettings.edgeSensitivity;
    const background = await jimp.create(
      128 + 3,
      64 + 3,
      imageSettings.invert ? "white" : "black"
    );
    jimpImage = background.composite(
      jimpImage,
      (128 - jimpImage.getWidth()) / 2 + 3,
      (64 - jimpImage.getHeight()) / 2 + 3
    );
    // makes thicker edges
    // await jimpImage.convolute([
    //   [0, 0, factor, 0, 0],
    //   [0, 0, factor, 0, 0],
    //   [factor, factor, factor * 8 * -1, factor, factor],
    //   [0, 0, factor, 0, 0],
    //   [0, 0, factor, 0, 0],
    // ]);
    await jimpImage.convolute([
      [0, factor, 0],
      [factor, factor * 4 * -1, factor],
      [0, factor, 0],
    ]);
    jimpImage.crop(3, 3, jimpImage.getWidth() - 3, jimpImage.getHeight() - 3);
    // dither part
    jimpImage.composite(
      ditherImage,
      (128 - ditherImage.getWidth()) / 2,
      (64 - ditherImage.getHeight()) / 2,
      {
        mode: jimp.BLEND_ADD,
        opacityDest: 1,
        opacitySource: 1,
      }
    );
    // dither part end
  } else if (imageSettings.imageMode === EImageMode.normal) {
    await jimpImage.threshold({
      max: imageSettings.whiteThreshold,
      replace: imageSettings.blackThreshold,
      autoGreyscale: false,
    });
    if (imageSettings.invert) jimpImage.invert();
  }
  await jimpImage.autocrop();

  const background = await import("jimp").then(
    (jimp) => new jimp.default(128, 64, "black")
  );

  if (textSettings.text?.length) {
    const font = await jimp.loadFont(textSettings.font);

    const fontSize = font.common.lineHeight - 2;
    let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
    if (textSettings.position === ETextPosition.right) {
      jimpImage.scaleToFit(128 * textWithIconSettings.iconWidthMultiplier, 64);
    } else {
      jimpImage.scaleToFit(128, 64 - fontSize * lines.length);
    }
    const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
    const offset = (64 - overAllLineHeight) / 2;
    await Promise.all(
      lines.map(async (line, index) => {
        if (textSettings.position === ETextPosition.bottom) {
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
    if (textSettings.position === ETextPosition.bottom) {
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

export const _composeText = async (
  textSettings: Display["textSettings"]
): Promise<Buffer> => {
  const image = await import("jimp").then((jimp) =>
    jimp.default.create(128, 64, "black")
  );
  const font = await import("jimp").then((jimp) =>
    jimp.default.loadFont(textSettings.font)
  );
  const fontSize = font.common.lineHeight - 2;
  let lines = textSettings.text?.split(/\r?\n/).filter((line) => line) ?? [];
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

export const composeImage = debounce(_composeImage, 1, {
  leading: true,
  maxWait: 16,
});
export const composeText = debounce(
  (settings: Display) => _composeText(settings.textSettings),
  1,
  {
    leading: true,
    maxWait: 16,
  }
);
