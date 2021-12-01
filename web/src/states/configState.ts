import cloneDeep from "lodash/cloneDeep";
import { createContext } from "react";
import { v4 } from "uuid";

import { createDefaultBackDisplay } from "../definitions/defaultBackImage";
import {
  createDefaultDisplay,
  createDefaultDisplayButton,
  createDefaultPage,
} from "../definitions/defaultPage";
import { EAction } from "../definitions/modes";
import {
  IButtonSetting,
  ICollection,
  ICollections,
  IDisplaySettings,
  IOriginalImage,
  IPage,
  IPages,
} from "../interfaces";
import { generateAdditionalImagery } from "../lib/configFile/parseConfig";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface ConfigState {
  configVersion: string;
  brightness: number;
  screenSaverTimeout: number;
  width: number;
  height: number;
  pages: IPages;
  collections: ICollections;
  defaultBackDisplay: IDisplaySettings;
}
export const defaultConfigState = async (): Promise<ConfigState> => ({
  configVersion: (await import("../../package.json")).configFileVersion,
  brightness: 200,
  screenSaverTimeout: 0 * 60 * 1000, // in milliseconds
  width: 3,
  height: 2,
  pages: {
    byId: {},
    sorted: [],
  },
  collections: {
    byId: {},
    sorted: [],
  },
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
    data: {
      previousPage?: string;
      previousDisplay?: number;
      secondary?: boolean;
      startPage?: boolean;
    }
  ): Promise<ConfigState>;
  renamePage(
    state: ConfigState,
    data: { pageId: string; name: string }
  ): Promise<ConfigState>;
  deletePage(state: ConfigState, pageId: string): Promise<ConfigState>;
  changePageWindowName(
    state: ConfigState,
    data: { pageId: string; windowName: string }
  ): Promise<ConfigState>;
  setPageCollection(
    state: ConfigState,
    data: { pageId: string; collectionId: string }
  ): Promise<ConfigState>;
  renameCollection(
    state: ConfigState,
    data: { collectionId: string; name: string }
  ): Promise<ConfigState>;
  changeCollectionWindowName(
    state: ConfigState,
    data: { collectionId: string; windowName: string }
  ): Promise<ConfigState>;
  createCollection(state: ConfigState, data: {}): Promise<ConfigState>;
  deleteCollection(
    state: ConfigState,
    data: { collectionId: string }
  ): Promise<ConfigState>;
  setButtonSettings(
    state: ConfigState,
    data: {
      buttonSettings: IButtonSetting;
      priOrSec: "primary" | "secondary";
      pageId: string;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setDisplaySettings(
    state: ConfigState,
    data: {
      displaySettings: IDisplaySettings;
      pageId: string;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setOriginalImage(
    state: ConfigState,
    data: {
      pageId: string;
      buttonIndex: number;
      originalImage: IOriginalImage;
    }
  ): Promise<ConfigState>;
  deleteImage(
    state: ConfigState,
    data: {
      pageId: string;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  switchButtons(
    state: ConfigState,
    data: {
      pageAId: string;
      buttonAIndex: number;
      pageBId: string;
      buttonBIndex: number;
    }
  ): Promise<ConfigState>;
  updateAllDefaultBackImages(state: ConfigState): Promise<ConfigState>;
  makeDefaultBackButton(
    state: ConfigState,
    data: { pageId: string; buttonIndex: number }
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
        Object.entries(state.pages.byId.byId).forEach(async ([id, page]) =>
          page.displayButtons.push(await createDefaultDisplayButton())
        );
      }
    } else if (width * height < state.width * state.height) {
      Object.entries(state.pages.byId).map(
        ([id, page]) =>
          (state.pages.byId[id].displayButtons = page.displayButtons.slice(
            0,
            width * height
          ))
      );
    }
    state.width = width;
    state.height = height;
    return { ...state };
  },
  async addPage(state, data) {
    const newPage = await createDefaultPage(
      state.width * state.height,
      data.previousPage
    );
    if (state.pages.sorted.length === 0) newPage.name = "Start";
    const newId = v4();
    state.pages.byId[newId] = newPage;
    state.pages.sorted.push(newId);
    const {
      previousPage,
      previousDisplay,
      secondary = false,
      startPage,
    } = data;
    if (
      previousPage !== undefined &&
      previousDisplay !== undefined &&
      secondary !== undefined
    ) {
      state.pages.byId[previousPage].displayButtons[previousDisplay].button[
        secondary ? "secondary" : "primary"
      ].values[EAction.changePage] = newId;
    } else if (startPage === true) {
      state.pages.byId[newId].isStartPage = true;
      state.pages.byId[newId].name = "Start";
    }
    return { ...state };
  },
  async renamePage(state: ConfigState, { pageId, name }) {
    state.pages.byId[pageId].name = name;
    console.log("renamed", pageId, name);
    return { ...state };
  },
  async changePageWindowName(state: ConfigState, { pageId, windowName }) {
    state.pages.byId[pageId].windowName = windowName;
    return { ...state };
  },
  async deletePage(state, pageId) {
    const collectionId = state.pages.byId[pageId].isInCollection;

    state.pages.sorted = [...state.pages.sorted.filter((id) => id !== pageId)];
    delete state.pages.byId[pageId];

    // remove page from collection
    if (collectionId)
      state.collections.byId[collectionId].pages = [
        ...state.collections.byId[collectionId].pages.filter(
          (p) => p !== pageId
        ),
      ];

    Object.entries(state.pages.byId).forEach(([id, page]) => {
      page.displayButtons.forEach((db, index) => {
        if (db.button.primary.values[EAction.changePage] === pageId)
          state.pages.byId[id].displayButtons[index].button.primary.values[
            EAction.changePage
          ] = "";
        if (db.button.secondary.values[EAction.changePage] === pageId)
          state.pages.byId[id].displayButtons[index].button.secondary.values[
            EAction.changePage
          ] = "";
      });
    });
    return { ...state };
  },
  async setPageCollection(state, { pageId, collectionId }) {
    console.log({ collectionId });
    if (collectionId !== undefined) {
      state.collections.byId[collectionId].pages.push(pageId);
      state.pages.byId[pageId].isInCollection = collectionId;
    } else {
      const colId = state.pages.byId[pageId].isInCollection!;
      state.collections.byId[colId].pages = [
        ...state.collections.byId[colId].pages.filter((pid) => pid !== pageId),
      ];
      state.pages.byId[pageId].isInCollection = undefined;
    }
    return { ...state };
  },
  async createCollection(state: ConfigState) {
    const newId = v4();
    state.collections.byId[newId] = { pages: [] };
    state.collections.sorted.push(newId);
    return {
      ...state,
    };
  },
  async deleteCollection(state: ConfigState, { collectionId }) {
    state.collections.byId[collectionId].pages.forEach(
      (pageId) => (state.pages.byId[pageId].isInCollection = undefined)
    );
    delete state.collections.byId[collectionId];
    state.collections.sorted = [
      ...state.collections.sorted.filter((cid) => cid !== collectionId),
    ];
    return {
      ...state,
    };
  },
  async renameCollection(state, { collectionId, name }) {
    state.collections.byId[collectionId].name = name;
    return { ...state };
  },
  async changeCollectionWindowName(state, { collectionId, windowName }) {
    state.collections.byId[collectionId].windowName = windowName;
    return { ...state };
  },
  async setButtonSettings(state, data) {
    const { pageId, buttonIndex, priOrSec, buttonSettings } = data;
    state.pages.byId[pageId].displayButtons[buttonIndex].button[priOrSec] =
      buttonSettings;
    return { ...state };
  },
  async setDisplaySettings(state, data) {
    const { pageId, buttonIndex, displaySettings } = data;
    if (pageId === "dbd") {
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
      state.pages.byId[pageId].displayButtons[buttonIndex].display = {
        ...displaySettings,
        isGeneratedFromDefaultBackImage: false,
      };
      state.pages.byId[pageId].displayButtons[buttonIndex].display =
        await generateAdditionalImagery(
          state.pages.byId[pageId].displayButtons[buttonIndex].display
        );
    }
    return { ...state };
  },
  async setOriginalImage(state, data) {
    const { buttonIndex, pageId, originalImage } = data;

    if (pageId === "dbd") {
      state.defaultBackDisplay.originalImage = originalImage;
      state.defaultBackDisplay = await generateAdditionalImagery(
        state.defaultBackDisplay
      );
    } else {
      state.pages.byId[pageId].displayButtons[
        buttonIndex
      ].display.originalImage = originalImage;
      state.pages.byId[pageId].displayButtons[buttonIndex].display =
        await generateAdditionalImagery(
          state.pages.byId[pageId].displayButtons[buttonIndex].display
        );
    }
    if (pageId === "dbd") {
      return cloneDeep(await configReducer.updateAllDefaultBackImages(state));
    }
    return { ...state };
  },
  async deleteImage(state, data) {
    const { buttonIndex, pageId } = data;
    state.pages.byId[pageId].displayButtons[buttonIndex].display =
      createDefaultDisplay();
    return { ...state };
  },
  async switchButtons(state, data) {
    const { pageAId, pageBId, buttonAIndex, buttonBIndex } = data;
    const tempA = state.pages.byId[pageAId].displayButtons[buttonAIndex];
    state.pages.byId[pageAId].displayButtons[buttonAIndex] = cloneDeep(
      state.pages.byId[pageBId].displayButtons[buttonBIndex]
    );
    state.pages.byId[pageBId].displayButtons[buttonBIndex] = cloneDeep(tempA);
    return { ...state };
  },
  async updateAllDefaultBackImages(state) {
    Object.entries(state.pages.byId).forEach(([pageId, page]) => {
      page.displayButtons.forEach((displayButton, displayIndex) => {
        if (displayButton.display.isGeneratedFromDefaultBackImage)
          state.pages.byId[pageId].displayButtons[displayIndex].display =
            cloneDeep(state.defaultBackDisplay);
      });
    });
    return { ...state };
  },
  async makeDefaultBackButton(state, data) {
    const { buttonIndex, pageId } = data;
    state.pages.byId[pageId].displayButtons[buttonIndex].display =
      await state.defaultBackDisplay;
    return { ...state };
  },
  async resetDefaultBackButton(state) {
    return {
      ...state,
      defaultBackDisplay: await createDefaultBackDisplay("dbd"),
    };
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
