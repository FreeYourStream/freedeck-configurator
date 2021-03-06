import { Buffer } from "buffer";

/**
 * @param width number of displays horizontal.
 * @param height number of displays vertical.
 * @param brightness default brightness 0-255.
 * @param numberOfPages 0-65535.
 * @example ```txt
 * The header is 16 bytes long:
 * - 0: width
 * - 1: height
 * - 2-3: image data offset (numberOfPages * width * height + 1)
 * - 4: brightness
 * - 5-8: display timeout (0=always on)
 * ```
 */
export const createHeader = (
  width: number,
  height: number,
  brightness: number,
  numberOfPages: number
): Buffer => {
  // const header = new Buffer(16);
  const header = Buffer.alloc(16);

  // write width and height
  header.writeUInt8(width, 0);
  header.writeUInt8(height, 1);

  // check that we dont have more than 65535 pages
  if (Math.pow(2, 16) - 1 < numberOfPages) {
    alert("too many pages");
    throw new Error("too many pages");
  }
  // write the "row" offset where images begin
  // one row is 16 bytes, so we write the actual byte offset value divided by 16
  // we add 1 for the header row
  header.writeUInt16LE(numberOfPages * width * height + 1, 2);
  header.writeUInt8(brightness, 4);
  return header;
};
