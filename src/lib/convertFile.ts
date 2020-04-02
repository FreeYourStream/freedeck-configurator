import fs from "floyd-steinberg";
import Jimp from "jimp";
import { PNG } from "pngjs";

import { binaryConversion } from "./bufferToHexString";
import { imageToBinaryBuffer } from "./bwConversion";

export interface IConverted {
  bytes: Buffer;
  base64: string;
}

export const composeImage = (
  image: Jimp,
  width: number,
  height: number,
  contrast: number,
  invert: boolean,
  dither: boolean
): Promise<Buffer> => {
  return new Promise(async resolve => {
    const jimpImage = new Jimp(image);
    const pngImage = new PNG();
    if (invert) jimpImage.invert();
    await jimpImage.contrast(contrast);
    jimpImage.autocrop().scaleToFit(width, height);
    const jimpPNG = await jimpImage.getBufferAsync("image/png");

    pngImage.parse(jimpPNG, async (err, data) => {
      if (dither) data = fs(data);
      const buffer = PNG.sync.write(data);
      const jimpImage = await Jimp.read(buffer);
      const background = new Jimp(width, height, "black");
      background.composite(
        jimpImage,
        width / 2 - jimpImage.getWidth() / 2,
        height / 2 - jimpImage.getHeight() / 2
      );
      const { binary } = imageToBinaryBuffer(background, width, height);
      const bytes = binaryConversion(binary);
      resolve(bytes);
    });
  });
};
