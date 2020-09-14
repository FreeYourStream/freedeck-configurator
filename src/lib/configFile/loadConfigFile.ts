import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";
import { handleFileSelect } from "../handleFileSelect";
import { parseConfig } from "./parseConfig";
const isBuffer = (data: Buffer | FileList): data is Buffer => {
  return !!(data as Buffer).byteLength;
};
export const loadConfigFile = async (
  fileList: FileList | Buffer,
  setWidth: React.Dispatch<React.SetStateAction<number>>,
  setHeight: React.Dispatch<React.SetStateAction<number>>,
  setButtonSettingsPages: React.Dispatch<React.SetStateAction<IButtonPage[]>>,
  setDisplaySettingsPages: React.Dispatch<React.SetStateAction<IDisplayPage[]>>,
  setOriginalImagePages: React.Dispatch<
    React.SetStateAction<IOriginalImagePage[]>
  >,
  setConvertedImagePages: React.Dispatch<
    React.SetStateAction<IConvertedImagePage[]>
  >,
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >
) => {
  const file = isBuffer(fileList)
    ? fileList
    : Buffer.from(await handleFileSelect(fileList[0]));
  const config = parseConfig(file);
  console.log(config);
  setHeight(config.height);
  setWidth(config.width);
  setDefaultBackDisplay(config.defaultBackDisplay);
  setOriginalImagePages(config.originalImagePages);
  setButtonSettingsPages(config.buttonSettingsPages);
  setConvertedImagePages(config.convertedImagePages);
  setDisplaySettingsPages(config.displaySettingsPages);
};
