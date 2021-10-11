import { Buffer } from "buffer";

import {
  IButtonSettingsPage,
  IConvertedImagePage,
  IDisplay,
  IDisplaySettingsPage,
  IOriginalImagePage,
} from "../../interfaces";
import { monochrome128by64BitmapHeader } from "../../definitions/headers";
import { unoptimizeFromSSD1306 } from "./ssd1306";
import { State } from "../../state";

export const parseConfig = (configBuffer: Buffer): State => {
  const width = configBuffer.readUInt8(0);
  const height = configBuffer.readUInt8(1);
  const brightness = configBuffer.readUInt8(4);
  const displaysPerPage = width * height;

  const displayButtonCount = configBuffer.readUInt16LE(2) - 1; // subtract 1 for the header row

  const imageOffset = 16 * (displayButtonCount + 1);
  const jsonOffset = imageOffset + 1024 * displayButtonCount;

  if (configBuffer.length === jsonOffset) {
    alert("config too old. not compatible yet. please create a new one");
    throw new Error(
      "config too old. not compatible (yet). please create a new one"
    );
  }
  const jsonConfigSlice = configBuffer.slice(jsonOffset);
  const rawConfig = JSON.parse(jsonConfigSlice.toString());
  return rawConfig;
};
