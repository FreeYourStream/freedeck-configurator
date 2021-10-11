import {
  IButtonSettingsPage,
  IDisplay,
  IDisplaySettingsPage,
  IOriginalImagePage,
} from "../../interfaces";

export const createFooter = (config: {
  displaySettingsPages: IDisplaySettingsPage[];
  buttonSettingsPages: IButtonSettingsPage[];
  defaultBackDisplay: IDisplay;
  originalImagePages: IOriginalImagePage[];
}) => {
  //save this at the end of the config
  return Buffer.from(JSON.stringify(config), "binary");
};
