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
export const imageToBlackAndWhiteBuffer = (
  image: Jimp,
  width: number,
  height: number
) => {
  const binary: number[] = [];
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      const values = Jimp.intToRGBA(image.getPixelColor(j, i));
      const bw = (values.r + values.g + values.b) / 3 > 128 ? 1 : 0;
      binary.push(bw);
    }
  }
  const numberArray = binary.reduce((acc, val, i, array) => {
    if (i % 8 === 0) {
      // acc.push(array.slice(i, i + 8).reverse().reduce((acc, val, i) => acc + (val * Math.pow(2, i)), 0))
      acc.push(parseInt(array.slice(i, i + 8).join(""), 2)) // thats faster
    }
    return acc
  }, [] as number[])
  return new Buffer(numberArray);
};

