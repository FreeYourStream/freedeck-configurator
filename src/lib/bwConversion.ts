import Jimp from "jimp";
import { bmp } from "../definitions/headers";

export const bwConversion = (image: Jimp) => {
  const newArrayRGBA: number[] = [...bmp];
  const newArrayRGB: number[] = [...bmp];
  for (var i = 0; i < 64; i++) {
    for (var j = 0; j < 128; j++) {
      const values = Jimp.intToRGBA(image.getPixelColor(j, i));
      const bw = (values.r + values.g + values.b) / 3 > 128 ? 255 : 0;
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
    }
  }
  return { rgba: Buffer.from(newArrayRGBA), rgb: Buffer.from(newArrayRGB) };
};
