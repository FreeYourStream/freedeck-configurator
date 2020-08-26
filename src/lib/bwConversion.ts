import Jimp from "jimp";

export const imageToBinaryBuffer = (
  image: Jimp,
  width: number,
  height: number
) => {
  const binary: number[] = [];
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      const values = Jimp.intToRGBA(image.getPixelColor(j, i));
      const bw = (values.r + values.g + values.b) / 3 > 128 ? 255 : 0;
      binary.push(bw);
    }
  }
  return {
    binary: new Buffer(binary),
  };
};
