import { monochrome128by64BitmapHeader } from "../definitions/headers";

export const colorBitmapToMonochromeBitmap = async (
  bitmapBuffer: Buffer,
  width: number,
  height: number
) => {
  // strip the 24bit color header out
  const bitmapBody = bitmapBuffer.slice(bitmapBuffer.readUInt32LE(10));
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
  //put a monochrome bitmap header above the body again
  return Buffer.concat([
    new Buffer(monochrome128by64BitmapHeader()),
    new Buffer(monochromeBody),
  ]);
};
