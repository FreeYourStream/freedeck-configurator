import {
  IButtonPage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";

export const createFooter = (config: {
  displaySettingsPages: IDisplayPage[];
  buttonSettingsPages: IButtonPage[];
  defaultBackDisplay: IDefaultBackDisplay;
  originalImagePages: IOriginalImagePage[];
}) => {
  //save this at the end of the config
  return Buffer.from(JSON.stringify(config), "binary");
};
