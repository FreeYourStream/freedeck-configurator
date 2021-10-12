import { ConfigState } from "../../states/configState";

export const parseConfig = (configBuffer: Buffer): ConfigState => {
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
