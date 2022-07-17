import { monochrome128by64BitmapHeader } from "./headers";
export const getEmptyConvertedImage = () => {
  const header = new Buffer(monochrome128by64BitmapHeader());
  return Buffer.concat([header, new Buffer(1024)]);
};
