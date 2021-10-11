import { createContext } from "react";
import { createDefaultBackDisplay } from "./definitions/defaultBackImage";
import {
  createDefaultButtonSettingsPage,
  createDefaultDisplay,
  createDefaultDisplayPage,
} from "./definitions/defaultPage";
import { EAction } from "./definitions/modes";
import {
  IButtonSetting,
  IButtonSettingsPage,
  IDisplay,
  IDisplaySettingsPage,
  IOriginalImage,
} from "./interfaces";
import { getBase64Image } from "./lib/image/base64Encode";
import { composeImage, composeText } from "./lib/image/composeImage";

export interface State {
  brightness: number;
  width: number;
  height: number;
  buttonSettingsPages: IButtonSettingsPage[];
  displaySettingsPages: IDisplaySettingsPage[];
  defaultBackDisplay: IDisplay;
}
export const defaultState: () => Promise<State> = async () => ({
  brightness: 200,
  width: 3,
  height: 2,
  buttonSettingsPages: [],
  displaySettingsPages: [],
  defaultBackDisplay: await createDefaultBackDisplay(),
});

interface BaseActions<RetType> {
  [key: string]: (...args: any[]) => RetType;
}
type Actions = BaseActions<Promise<State>>;
declare type FunctionForFirstParamType<ParamType> = (arg0: ParamType) => void;

export interface IReducer extends Actions {
  setBrightness(state: State, brightness: number): Promise<State>;
  setWidth(state: State, width: number): Promise<State>;
  setHeight(state: State, height: number): Promise<State>;
  addPage(state: State, previousPage?: number): Promise<State>;
  deletePage(state: State, pageIndex: number): Promise<State>;
  setButtonSettings(
    state: State,
    data: {
      buttonSettings: IButtonSetting;
      priOrSec: "primary" | "secondary";
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<State>;
  setDisplaySettings(
    state: State,
    data: {
      displaySettings: IDisplay;
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<State>;
  setOriginalImage(
    state: State,
    data: {
      pageIndex: number;
      buttonIndex: number;
      originalImage: IOriginalImage;
    }
  ): Promise<State>;
  deleteImage(
    state: State,
    data: {
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<State>;
  switchButtons(
    state: State,
    data: {
      pageAIndex: number;
      buttonAIndex: number;
      pageBIndex: number;
      buttonBIndex: number;
    }
  ): Promise<State>;
  updateAllDefaultBackImages(state: State, data: IDisplay): Promise<State>;
  makeDefaultBackButton(
    state: State,
    data: { pageIndex: number; buttonIndex: number }
  ): Promise<State>;
  setState(state: State, newState: State): Promise<State>;
}

export const reducer: IReducer = {
  async setBrightness(state, brightness) {
    console.log("setBrightness");
    return { ...state, brightness };
  },
  async setWidth(state, width) {
    console.log("setWidth");
    return { ...state, width };
  },
  async setHeight(state, height) {
    console.log("setHeight");
    return { ...state, height };
  },
  async addPage(state, previousPage) {
    console.log("addPage");
    state.buttonSettingsPages.push(
      createDefaultButtonSettingsPage(state.width, state.height, previousPage)
    );
    state.displaySettingsPages.push(
      await createDefaultDisplayPage(state.width, state.height, previousPage)
    );
    return { ...state };
  },
  async deletePage(state, pageIndex) {
    console.log("deletePage");
    state.buttonSettingsPages.splice(pageIndex, 1);
    state.displaySettingsPages.splice(pageIndex, 1);
    state.buttonSettingsPages = state.buttonSettingsPages.map((page) => {
      return page.map((display) => {
        if (display.primary.mode === EAction.changePage) {
          if (display.primary.values[0] >= pageIndex) {
            display.primary.values[0] -= 1;
          }
        }
        if (
          display.secondary.enabled &&
          display.secondary.mode === EAction.changePage
        ) {
          if (display.secondary.values[0] >= pageIndex) {
            display.secondary.values[0] -= 1;
          }
        }
        return { ...display };
      });
    });
    return { ...state };
  },
  async setButtonSettings(state, data) {
    console.log("setButtonSettings");
    const { pageIndex, buttonIndex, priOrSec, buttonSettings } = data;
    state.buttonSettingsPages[pageIndex][buttonIndex][priOrSec] =
      buttonSettings;
    return { ...state };
  },
  async setDisplaySettings(state, data) {
    const { pageIndex, buttonIndex, displaySettings } = data;
    let display: IDisplay;
    if (pageIndex === -1 && buttonIndex === -1) {
      display = await state.defaultBackDisplay;
    } else {
      display = state.displaySettingsPages[pageIndex][buttonIndex];
    }
    display = displaySettings;
    display.convertedImage =
      displaySettings.textSettings.text?.length &&
      !displaySettings.originalImage
        ? await composeText(displaySettings)
        : await composeImage(displaySettings);
    display.previewImage = getBase64Image(display.convertedImage);
    state.displaySettingsPages[pageIndex][buttonIndex] = { ...display };
    return state;
  },
  async setOriginalImage(state, data) {
    console.log("setOriginalImage");
    const { buttonIndex, pageIndex, originalImage } = data;
    const display = state.displaySettingsPages[pageIndex][buttonIndex];
    display.originalImage = originalImage;
    display.convertedImage =
      display.textSettings.text?.length && !display.originalImage
        ? await composeText(display)
        : await composeImage(display);
    display.previewImage = getBase64Image(display.convertedImage);
    return { ...state };
  },
  async deleteImage(state, data) {
    console.log("deleteImage");
    const { buttonIndex, pageIndex } = data;
    state.displaySettingsPages[pageIndex][buttonIndex] = createDefaultDisplay();
    return { ...state };
  },
  async switchButtons(state, data) {
    console.log("switchButtons");
    const { pageAIndex, pageBIndex, buttonAIndex, buttonBIndex } = data;
    console.log(pageAIndex, buttonAIndex, pageBIndex, buttonBIndex);
    const buttonA = { ...state.buttonSettingsPages[pageAIndex][buttonAIndex] };
    state.buttonSettingsPages[pageAIndex][buttonAIndex] = {
      ...state.buttonSettingsPages[pageBIndex][buttonBIndex],
    };
    state.buttonSettingsPages[pageBIndex][buttonBIndex] = buttonA;

    const displayA = {
      ...state.displaySettingsPages[pageAIndex][buttonAIndex],
    };
    state.displaySettingsPages[pageAIndex][buttonAIndex] = {
      ...state.displaySettingsPages[pageBIndex][buttonBIndex],
    };
    state.displaySettingsPages[pageBIndex][buttonBIndex] = displayA;
    return { ...state };
  },
  async updateAllDefaultBackImages(state, newBackDisplay) {
    console.log("updateAllDefaultBackImages");
    state.displaySettingsPages.forEach((page, pageIndex) => {
      page.forEach((display, displayIndex) => {
        if (display.isGeneratedFromDefaultBackImage)
          state.displaySettingsPages[pageIndex][displayIndex] = newBackDisplay;
      });
    });
    return { ...state };
  },
  async makeDefaultBackButton(state, data) {
    console.log("makeDefaultBackButton");
    const { buttonIndex, pageIndex } = data;
    state.displaySettingsPages[pageIndex][buttonIndex] =
      await state.defaultBackDisplay;
    return { ...state };
  },
  async setState(state, newState) {
    console.log("setState");
    return { ...newState };
  },
};

export type IDispatch = {
  [PropertyType in keyof IReducer]: FunctionForFirstParamType<
    Parameters<IReducer[PropertyType]>[1]
  >;
};

export const StateContext = createContext<State>({} as unknown as any);
export const DispatchContext = createContext<IDispatch>(
  reducer as unknown as IDispatch
);
