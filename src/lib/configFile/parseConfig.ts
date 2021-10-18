import { ConfigState } from "../../states/configState";
import { convertLegacyConfig } from "./convertLegacyConfig";

export const parseConfig = async (
  configBuffer: Buffer
): Promise<ConfigState> => {
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
  if (!rawConfig.configVersion) {
    return await convertLegacyConfig(rawConfig, configBuffer);
  }
  return rawConfig;
};
