import { ROW_SIZE } from "./consts";

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
 * - 5-6: display timeout (0=always on)
 * - 7: oled speed (used for freedeck pico)
 * - 8: oled delay (used for freedeck ino)
 * - 9: oled preChargePeriod (to adjust coil whine)
 * - 10: oled refreshFrequency (to adjust coil whine and burn in)
 * - 11: save json (is json is saved in the config file)
 * ```
 */
export const createHeader = (
  width: number,
  height: number,
  brightness: number,
  screenTimeout: number,
  oledSpeed: number,
  oledDelay: number,
  preChargePeriod: number,
  refreshFrequency: number,
  saveJson: boolean,
  numberOfPages: number
): Buffer => {
  // const header = new Buffer(16);
  const header = Buffer.alloc(ROW_SIZE);

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
  header.writeUInt16LE(screenTimeout, 5);
  header.writeUInt8(oledSpeed, 7);
  header.writeUInt8(oledDelay, 8);
  header.writeUInt8(preChargePeriod, 9);
  header.writeUInt8(refreshFrequency, 10);
  header.writeUInt8(saveJson ? 1 : 0, 11);
  return header;
};
