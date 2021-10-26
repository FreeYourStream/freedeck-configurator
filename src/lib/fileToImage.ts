import { handleFileSelect } from "./handleFileSelect";
export const stringToImage = async (input: string) => {
  const jimage = await import("jimp").then((jimp) => jimp.default.read(input));
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
  const jimage = await import("jimp").then((jimp) =>
    jimp.default.read(Buffer.from(buffer))
  );
  const mime = jimage.getMIME();
  const newMime = mime === "image/jpeg" ? mime : "image/gif";
  const resizedBuffer = await jimage
    .quality(70)
    .scaleToFit(256, 128, "")
    .getBufferAsync(newMime);
  return resizedBuffer;
};
