import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";
import { handleFileSelect } from "../handleFileSelect";
import { parseConfig } from "./parseConfig";

export const loadConfigFile = async (
  fileList: FileList,
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
  const file = Buffer.from(await handleFileSelect(fileList[0]));
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
