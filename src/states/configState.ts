import { createContext } from "react";
import { createDefaultBackDisplay } from "../definitions/defaultBackImage";
import {
  createDefaultButtonSettings,
  createDefaultButtonSettingsPage,
  createDefaultDisplay,
  createDefaultDisplayPage,
} from "../definitions/defaultPage";
import { EAction } from "../definitions/modes";
import {
  IButtonSetting,
  IButtonSettingsPage,
  IDisplay,
  IDisplaySettingsPage,
  IOriginalImage,
} from "../interfaces";
import { getBase64Image } from "../lib/image/base64Encode";
import { composeImage, composeText } from "../lib/image/composeImage";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface ConfigState {
  brightness: number;
  width: number;
  height: number;
  buttonSettingsPages: IButtonSettingsPage[];
  displaySettingsPages: IDisplaySettingsPage[];
  defaultBackDisplay: IDisplay;
}
export const defaultConfigState: () => Promise<ConfigState> = async () => ({
  brightness: 200,
  width: 3,
  height: 2,
  buttonSettingsPages: [],
  displaySettingsPages: [],
  defaultBackDisplay: await createDefaultBackDisplay(),
});

export interface IConfigReducer extends Actions<ConfigState> {
  setBrightness(state: ConfigState, brightness: number): Promise<ConfigState>;
  setDimensions(
    state: ConfigState,
    data: { width?: number; height?: number }
  ): Promise<ConfigState>;
  addPage(state: ConfigState, previousPage?: number): Promise<ConfigState>;
  deletePage(state: ConfigState, pageIndex: number): Promise<ConfigState>;
  setButtonSettings(
    state: ConfigState,
    data: {
      buttonSettings: IButtonSetting;
      priOrSec: "primary" | "secondary";
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setDisplaySettings(
    state: ConfigState,
    data: {
      displaySettings: IDisplay;
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setOriginalImage(
    state: ConfigState,
    data: {
      pageIndex: number;
      buttonIndex: number;
      originalImage: IOriginalImage;
    }
  ): Promise<ConfigState>;
  deleteImage(
    state: ConfigState,
    data: {
      pageIndex: number;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  switchButtons(
    state: ConfigState,
    data: {
      pageAIndex: number;
      buttonAIndex: number;
      pageBIndex: number;
      buttonBIndex: number;
    }
  ): Promise<ConfigState>;
  updateAllDefaultBackImages(
    state: ConfigState,
    data: IDisplay
  ): Promise<ConfigState>;
  makeDefaultBackButton(
    state: ConfigState,
    data: { pageIndex: number; buttonIndex: number }
  ): Promise<ConfigState>;
  setState(state: ConfigState, newState: ConfigState): Promise<ConfigState>;
}

export const configReducer: IConfigReducer = {
  async setBrightness(state, brightness) {
    console.log("setBrightness");
    return { ...state, brightness };
  },
  async setDimensions(state, data) {
    console.log("setWidth");
    const width = data.width ?? state.width;
    const height = data.height ?? state.height;
    if (width * height > state.width * state.height) {
      const diff = width * height - state.width * state.height;
      for (let i = 0; i < diff; i++) {
        state.buttonSettingsPages.forEach((page) =>
          page.push(createDefaultButtonSettings())
        );
        state.displaySettingsPages.forEach((page) =>
          page.push(createDefaultDisplay())
        );
      }
    } else if (width * height < state.width * state.height) {
      state.buttonSettingsPages = state.buttonSettingsPages.map((page) =>
        page.slice(0, width * height)
      );
      state.displaySettingsPages = state.displaySettingsPages.map((page) =>
        page.slice(0, width * height)
      );
    }
    state.width = width;
    return { ...state };
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
  [PropertyType in keyof IConfigReducer]: FunctionForFirstParamType<
    Parameters<IConfigReducer[PropertyType]>[1]
  >;
};

export const ConfigStateContext = createContext<ConfigState>(
  {} as unknown as any
);
export const ConfigDispatchContext = createContext<IDispatch>(
  configReducer as unknown as IDispatch
);
