import Jimp from "jimp";
import { bmpHeader } from "../definitions/headers";

export const bwConversion = (image: Jimp, width: number, height: number) => {
  const newArrayRGBA: number[] = [...bmpHeader(width, height)];
  const newArrayRGB: number[] = [...bmpHeader(width, height)];
  const binary: number[] = [];
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      const values = Jimp.intToRGBA(image.getPixelColor(j, i));
      const bw = (values.r + values.g + values.b) / 3 > 128 ? 255 : 0;
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
      binary.push(bw);
    }
  }
  return {
    rgba: new Buffer(newArrayRGBA),
    rgb: new Buffer(newArrayRGB),
    binary: new Buffer(binary)
  };
};
