import { handleFileSelect } from "./handleFileSelect";
export const stringToImage = async (input: string) => {
  const jimp = (await import("jimp")).default;
  const jimage = await jimp.read(input);
  const mime = jimage.getMIME();
  const newMime = mime === "image/jpeg" ? mime : "image/gif";
  const resizedBuffer = await jimage
    .quality(70)
    .scaleToFit(256, 128, "")
    .getBufferAsync(newMime);
  return resizedBuffer;
};
export const fileToImage = async (file: File) => {
  const buffer = await handleFileSelect(file);
  const jimp = (await import("jimp")).default;
  const jimage = await jimp.read(Buffer.from(buffer));
  const mime = jimage.getMIME();
  const newMime = mime === "image/jpeg" ? mime : "image/gif";
  const resizedBuffer = await jimage
    .quality(70)
    .scaleToFit(256, 128, "")
    .getBufferAsync(newMime);
  return resizedBuffer;
};
