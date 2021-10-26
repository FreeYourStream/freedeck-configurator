import cloneDeep from "lodash/cloneDeep";
import { createContext } from "react";
import { createDefaultBackDisplay } from "../definitions/defaultBackImage";
import {
  createDefaultDisplay,
  createDefaultDisplayButton,
  createDefaultPage,
} from "../definitions/defaultPage";
import { EAction } from "../definitions/modes";
import {
  IButtonSetting,
  IDisplaySettings,
  IOriginalImage,
  IPage,
} from "../interfaces";
import { generateAdditionalImagery } from "../lib/configFile/parseConfig";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface ConfigState {
  configVersion: string;
  brightness: number;
  screenSaverTimeout: number;
  width: number;
  height: number;
  pages: IPage[];
  defaultBackDisplay: IDisplaySettings;
}
export const defaultConfigState = async (): Promise<ConfigState> => ({
  configVersion: (await import("../../package.json")).configFileVersion,
  brightness: 200,
  screenSaverTimeout: 0 * 60 * 1000, // in milliseconds
  width: 3,
  height: 2,
  pages: [],
  defaultBackDisplay: await createDefaultBackDisplay(),
});

export interface IConfigReducer extends Actions<ConfigState> {
  setBrightness(state: ConfigState, brightness: number): Promise<ConfigState>;
  setScreenSaver(state: ConfigState, timeout: number): Promise<ConfigState>;
  setDimensions(
    state: ConfigState,
    data: { width?: number; height?: number }
  ): Promise<ConfigState>;
  addPage(
    state: ConfigState,
    data?: { previousPage: number; previousDisplay: number }
  ): Promise<ConfigState>;
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
      displaySettings: IDisplaySettings;
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
  updateAllDefaultBackImages(state: ConfigState): Promise<ConfigState>;
  makeDefaultBackButton(
    state: ConfigState,
    data: { pageIndex: number; buttonIndex: number }
  ): Promise<ConfigState>;
  resetDefaultBackButton(state: ConfigState): Promise<ConfigState>;
  setState(state: ConfigState, newState: ConfigState): Promise<ConfigState>;
}

export const configReducer: IConfigReducer = {
  async setBrightness(state, brightness) {
    return { ...state, brightness };
  },
  async setScreenSaver(state, timeout) {
    return { ...state, screenSaverTimeout: timeout };
  },
  async setDimensions(state, data) {
    const width = data.width ?? state.width;
    const height = data.height ?? state.height;
    if (width * height > state.width * state.height) {
      const diff = width * height - state.width * state.height;
      for (let i = 0; i < diff; i++) {
        state.pages.forEach(async (page) =>
          page.push(await createDefaultDisplayButton())
        );
      }
    } else if (width * height < state.width * state.height) {
      state.pages = state.pages.map((page) => page.slice(0, width * height));
    }
    state.width = width;
    state.height = height;
    return { ...state };
  },
  async addPage(state, data) {
    const newPage = await createDefaultPage(
      state.width * state.height,
      data?.previousPage
    );
    state.pages.push(newPage);
    if (data) {
      const { previousDisplay, previousPage } = data;
      state.pages[previousPage][previousDisplay].button.primary.values = [
        state.pages.length - 1,
      ];
    }
    return { ...state };
  },
  async deletePage(state, pageIndex) {
    state.pages.splice(pageIndex, 1);
    state.pages = state.pages.map((page) => {
      return page.map((displayButton) => {
        if (displayButton.button.primary.mode === EAction.changePage) {
          if (displayButton.button.primary.values[0] >= pageIndex) {
            displayButton.button.primary.values[0] -= 1;
          }
        }
        if (
          displayButton.button.secondary.enabled &&
          displayButton.button.secondary.mode === EAction.changePage
        ) {
          if (displayButton.button.secondary.values[0] >= pageIndex) {
            displayButton.button.secondary.values[0] -= 1;
          }
        }
        return { ...displayButton };
      });
    });
    return { ...state };
  },
  async setButtonSettings(state, data) {
    const { pageIndex, buttonIndex, priOrSec, buttonSettings } = data;
    state.pages[pageIndex][buttonIndex].button[priOrSec] = buttonSettings;
    return { ...state };
  },
  async setDisplaySettings(state, data) {
    const { pageIndex, buttonIndex, displaySettings } = data;
    if (pageIndex === -1 && buttonIndex === -1) {
      state.defaultBackDisplay = { ...displaySettings };
      state.defaultBackDisplay = await generateAdditionalImagery(
        state.defaultBackDisplay
      );
      state.defaultBackDisplay.isGeneratedFromDefaultBackImage = true;
      localStorage.setItem(
        "defaultBackDisplay",
        JSON.stringify(state.defaultBackDisplay)
      );
      return cloneDeep(await configReducer.updateAllDefaultBackImages(state));
    } else {
      state.pages[pageIndex][buttonIndex].display = {
        ...displaySettings,
        isGeneratedFromDefaultBackImage: false,
      };
      state.pages[pageIndex][buttonIndex].display =
        await generateAdditionalImagery(
          state.pages[pageIndex][buttonIndex].display
        );
    }
    return { ...state };
  },
  async setOriginalImage(state, data) {
    const { buttonIndex, pageIndex, originalImage } = data;

    if (pageIndex === -1 && buttonIndex === -1) {
      state.defaultBackDisplay.originalImage = originalImage;
      state.defaultBackDisplay = await generateAdditionalImagery(
        state.defaultBackDisplay
      );
    } else {
      state.pages[pageIndex][buttonIndex].display.originalImage = originalImage;
      state.pages[pageIndex][buttonIndex].display =
        await generateAdditionalImagery(
          state.pages[pageIndex][buttonIndex].display
        );
    }
    if (pageIndex === -1 && buttonIndex === -1) {
      return cloneDeep(await configReducer.updateAllDefaultBackImages(state));
    }
    return { ...state };
  },
  async deleteImage(state, data) {
    const { buttonIndex, pageIndex } = data;
    state.pages[pageIndex][buttonIndex].display = createDefaultDisplay();
    return { ...state };
  },
  async switchButtons(state, data) {
    const { pageAIndex, pageBIndex, buttonAIndex, buttonBIndex } = data;
    const tempA = state.pages[pageAIndex][buttonAIndex];
    state.pages[pageAIndex][buttonAIndex] = cloneDeep(
      state.pages[pageBIndex][buttonBIndex]
    );
    state.pages[pageBIndex][buttonBIndex] = cloneDeep(tempA);
    return { ...state };
  },
  async updateAllDefaultBackImages(state) {
    state.pages.forEach((page, pageIndex) => {
      page.forEach((displayButton, displayIndex) => {
        if (displayButton.display.isGeneratedFromDefaultBackImage)
          state.pages[pageIndex][displayIndex].display = cloneDeep(
            state.defaultBackDisplay
          );
      });
    });
    return { ...state };
  },
  async makeDefaultBackButton(state, data) {
    const { buttonIndex, pageIndex } = data;
    state.pages[pageIndex][buttonIndex].display =
      await state.defaultBackDisplay;
    return { ...state };
  },
  async resetDefaultBackButton(state) {
    return { ...state, defaultBackDisplay: await createDefaultBackDisplay(-1) };
  },
  async setState(state, newState) {
    return { ...newState };
  },
};

type IDispatch = {
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
