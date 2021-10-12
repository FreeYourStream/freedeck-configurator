import { ConfigState } from "../../states/configState";
import { handleFileSelect } from "../handleFileSelect";
import { parseConfig } from "./parseConfig";
const isBuffer = (data: Buffer | FileList): data is Buffer => {
  return !!(data as Buffer).byteLength;
};
export const loadConfigFile = async (
  fileList: FileList | Buffer,
  setState: (newState: ConfigState) => any
) => {
  const file = isBuffer(fileList)
    ? fileList
    : Buffer.from(await handleFileSelect(fileList[0]));
  const config = parseConfig(file);
  setState(config);

  // setDefaultBackDisplay(config.defaultBackDisplay);
  // setOriginalImagePages(config.originalImagePages);
  // setButtonSettingsPages(config.buttonSettingsPages);
  // setConvertedImagePages(config.convertedImagePages);
  // setDisplaySettingsPages(config.displaySettingsPages);
};
