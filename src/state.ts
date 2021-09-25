import { createContext, Reducer } from "react";
import {
  createDefaultButtonSettingsPage,
  createDefaultDisplaySettingsPage,
} from "./definitions/defaultPage";
import {
  IButtonSettingsPage,
  IButtonSetting,
  IDisplaySettingsPage,
} from "./interfaces";

export type Action =
  | { type: "setBrightness"; brightness: number }
  | { type: "setWidth"; width: number }
  | { type: "setHeight"; height: number }
  | { type: "addPage"; previousPage?: number }
  | {
      type: "setButtonSettings";
      buttonSettings: IButtonSetting;
      priOrSec: "primary" | "secondary";
      pageIndex: number;
      buttonIndex: number;
    };

export interface State {
  brightness: number;
  width: number;
  height: number;
  buttonSettingsPages: IButtonSettingsPage[];
  displaySettingsPages: IDisplaySettingsPage[];
}
export const defaultState: State = {
  brightness: 200,
  width: 3,
  height: 2,
  buttonSettingsPages: [],
  displaySettingsPages: [],
};
export const reducer: Reducer<State, Action> = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "setBrightness":
      newState.brightness = action.brightness;
      break;
    case "setWidth":
      newState.width = action.width;
      break;
    case "setHeight":
      newState.height = action.height;
      break;
    case "addPage":
      newState.buttonSettingsPages.push(
        createDefaultButtonSettingsPage(
          newState.width,
          newState.height,
          action.previousPage
        )
      );
      newState.displaySettingsPages.push(
        createDefaultDisplaySettingsPage(
          newState.width,
          newState.height,
          action.previousPage
        )
      );
      break;
    case "setButtonSettings":
      const { pageIndex, buttonIndex, priOrSec, buttonSettings } = action;
      newState.buttonSettingsPages[pageIndex][buttonIndex][priOrSec] =
        buttonSettings;
      break;
    default:
      break;
  }
  return newState;
};

export const StateContext = createContext<State>(defaultState);
export const DispatchContext = createContext<React.Dispatch<Action>>(() => {});
