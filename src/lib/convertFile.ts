import { PNG } from "pngjs";
import Jimp from "jimp";
import fs from "floyd-steinberg";
import { bwConversion } from "./bwConversion";
import { bitConversion } from "./bufferToHexString";
import { encode } from "./uint8ToBase64";

export const convertFile = (
  imageArrayBuffer: ArrayBuffer,
  contrast: number,
  invert: boolean,
  dither: boolean
): Promise<{ base64: string; hex: string }> => {
  return new Promise(async resolve => {
    const pngImage = new PNG();
    const jimpImage = await Jimp.read(Buffer.from(imageArrayBuffer));
    if (invert) jimpImage.invert();
    await jimpImage.contrast(contrast);
    jimpImage.autocrop().scaleToFit(128, 64);
    const jimpPNG = await jimpImage.getBufferAsync("image/png");

    pngImage.parse(jimpPNG, async (err, data) => {
      if (dither) data = fs(data);
      const buffer = PNG.sync.write(data);
      const jimpImage = await Jimp.read(buffer);
      const background = new Jimp(128, 64, "black");
      background.composite(
        jimpImage,
        64 - jimpImage.getWidth() / 2,
        32 - jimpImage.getHeight() / 2
      );
      const converted = bwConversion(background);
      // slice removes bitmap header
      const hexConverted = bitConversion(converted.rgba.slice(55), 128);
      resolve({
        base64: "data:image/bmp;base64," + encode(converted.rgb),
        hex: hexConverted
      });
    });
  });
};
