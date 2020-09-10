import Jimp from "jimp";

// export const imageToBlackAndWhiteBuffer = (
//   image: Jimp,
//   width: number,
//   height: number
// ) => {
//   const binary: number[] = [];
//   for (var i = 0; i < height; i++) {
//     for (var j = 0; j < width; j++) {
//       const values = Jimp.intToRGBA(image.getPixelColor(j, i));
//       const bw = (values.r + values.g + values.b) / 3 > 128 ? 255 : 0;
//       binary.push(bw);
//     }
//   }
//   return new Buffer(binary);
// };
export const imageToBlackAndWhiteBuffer = async (
  image: Jimp,
  width: number,
  height: number
) => {
  const bitmap = await image.getBufferAsync("image/bmp");
  const bitmapBody = bitmap.slice(bitmap.readUInt32LE(10));
  const blackAndWhite = [];
  // black and white through threshold
  for (let pixel = 0; pixel < width * height; pixel++) {
    const r = bitmapBody.readUInt8(pixel * 3);
    const g = bitmapBody.readUInt8(pixel * 3 + 1);
    const b = bitmapBody.readUInt8(pixel * 3 + 2);
    const saturation = (r + g + b) / 3 > 128 ? 1 : 0;
    blackAndWhite.push(saturation);
  }

  //black and white to monochrome bitmap format
  const monochromeBody = [];
  for (let i = 0; i < (width * height) / 8; i++) {
    const offset = i * 8;
    const part = blackAndWhite.slice(offset, offset + 8).join("");
    const number = parseInt(part, 2);
    monochromeBody.push(number); // thats faster
  }
  return new Buffer(monochromeBody);
};
