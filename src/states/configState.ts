import Joi from "joi";
import cloneDeep from "lodash/cloneDeep";
import { createContext } from "react";
import { v4 } from "uuid";

import { createDefaultBackDisplay } from "../definitions/defaultBackImage";
import {
  createDefaultDisplayButton,
  createDefaultPage,
} from "../definitions/defaultPage";
import { EAction } from "../definitions/modes";
import { ButtonSetting, Collections, Display, Page, Pages } from "../generated";
import {
  PageDocument,
  PageQuery,
  PageQueryVariables,
} from "../generated/types-and-hooks";
import { generateAdditionalImagery } from "../lib/configFile/parseConfig";
import { PageSchema } from "../schemas/config";
import { Actions, FunctionForFirstParamType } from "./interfaces";
import { client } from "..";

const saveConfigToLocalStorage = (state: ConfigState) => {
  setTimeout(() => localStorage.setItem("config", JSON.stringify(state)));
  return { ...state };
};

const changePageDimension = async (
  page: Page,
  oldCount: number,
  newCount: number
) => {
  if (newCount > oldCount) {
    const diff = newCount - oldCount;
    for (let i = 0; i < diff; i++) {
      page.displayButtons.push(await createDefaultDisplayButton());
    }
  } else if (newCount < oldCount) {
    page.displayButtons = page.displayButtons.slice(0, newCount);
  }
  return { ...page };
};

export interface ConfigState {
  configVersion: string;
  brightness: number;
  screenSaverTimeout: number;
  width: number;
  height: number;
  pages: Pages;
  collections: Collections;
  defaultBackDisplay: Display;
}
export const defaultConfigState = async (): Promise<ConfigState> => ({
  configVersion: (await import("../../package.json")).configFileVersion,
  brightness: 100,
  screenSaverTimeout: 1 * 60 * 1000, // in milliseconds
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
  setStartPage(
    state: ConfigState,
    data: { pageId: string }
  ): Promise<ConfigState>;
  downloadPage(
    state: ConfigState,
    data: {
      id: string;
    }
  ): Promise<ConfigState>;
  renamePage(
    state: ConfigState,
    data: { pageId: string; name: string }
  ): Promise<ConfigState>;
  deletePage(state: ConfigState, pageId: string): Promise<ConfigState>;
  deleteDisplayButton(
    state: ConfigState,
    data: { pageId: string; buttonIndex: number }
  ): Promise<ConfigState>;
  setPagePublished(
    state: ConfigState,
    data: { pageId: string; forkedId?: string }
  ): Promise<ConfigState>;
  changePageWindowName(
    state: ConfigState,
    data: { pageId: string; windowName: string }
  ): Promise<ConfigState>;
  setPageCollection(
    state: ConfigState,
    data: { pageId: string; collectionId: string }
  ): Promise<ConfigState>;
  setUsePageName(
    state: ConfigState,
    data: { pageId: string; value: boolean }
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
  setUseCollectionName(
    state: ConfigState,
    data: { collectionId: string; value: boolean }
  ): Promise<ConfigState>;
  setButtonSettings(
    state: ConfigState,
    data: {
      buttonSettings: ButtonSetting;
      priOrSec: "primary" | "secondary";
      pageId: string;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setLeavePage(
    state: ConfigState,
    data: {
      pageId: string;
      buttonIndex: number;
      targetPageId?: string;
      enabled: boolean;
    }
  ): Promise<ConfigState>;
  setDisplaySettings(
    state: ConfigState,
    data: {
      displaySettings: Display;
      pageId: string;
      buttonIndex: number;
    }
  ): Promise<ConfigState>;
  setOriginalImage(
    state: ConfigState,
    data: {
      pageId: string;
      buttonIndex: number;
      originalImage: Buffer;
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
  copyButton(
    state: ConfigState,
    data: {
      pageSrcId: string;
      pageDestId: string;
      buttonSrcIndex: number;
      buttonDestIndex: number;
    }
  ): Promise<ConfigState>;
  switchPages(
    state: ConfigState,
    data: {
      pageAId: string;
      pageBId: string;
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
    state.brightness = brightness;
    return saveConfigToLocalStorage(state);
  },
  async setScreenSaver(state, timeout) {
    state.screenSaverTimeout = timeout;
    return saveConfigToLocalStorage(state);
  },
  async setDimensions(state, data) {
    const width = data.width ?? state.width;
    const height = data.height ?? state.height;
    for (let i = 0; i < state.pages.sorted.length; i++) {
      const pageId = state.pages.sorted[i];
      const page = state.pages.byId[pageId];
      state.pages.byId[pageId] = await changePageDimension(
        page,
        state.width * state.height,
        width * height
      );
    }

    state.width = width;
    state.height = height;
    return saveConfigToLocalStorage(state);
  },
  async addPage(state, data) {
    const newPage = await createDefaultPage(
      state.width * state.height,
      data.previousPage
    );
    const newId = v4();
    state.pages.byId[newId] = newPage;
    state.pages.sorted.push(newId);
    const { previousPage, previousDisplay, secondary = false } = data;
    if (
      previousPage !== undefined &&
      previousDisplay !== undefined &&
      secondary !== undefined
    ) {
      state.pages.byId[previousPage].displayButtons[previousDisplay].button[
        secondary ? "secondary" : "primary"
      ].values[EAction.changePage] = newId;
    } else if (state.pages.sorted.length === 1) {
      state.pages.byId[newId].name = "Start";
    }
    return saveConfigToLocalStorage(state);
  },
  async setStartPage(state, { pageId }) {
    state.pages.sorted = [
      ...state.pages.sorted.filter((pid) => pid !== pageId),
    ];
    state.pages.sorted.unshift(pageId);
    return saveConfigToLocalStorage(state);
  },
  async downloadPage(state: ConfigState, { id }) {
    const response = await client?.query<PageQuery>({
      query: PageDocument,
      variables: { id },
    });
    if (!response) {
      window.advancedAlert("Error", "There was an error receiving this page");
      return { ...state };
    }
    const validatedPage: Joi.ValidationResult<Page> = PageSchema.validate(
      response?.data.page?.data,
      { stripUnknown: true }
    );
    if (validatedPage.error) {
      window.advancedAlert(
        "This page is not compatible",
        validatedPage.error.message
      );
      return { ...state };
    }
    const page = validatedPage.value;
    state.pages.byId[id] = await changePageDimension(
      {
        ...cloneDeep(page),
        publishData: {
          createdBy: response.data.page.createdBy.id,
          forkedFrom: response.data.page.forkedFrom?.id,
        },
      },
      page.displayButtons.length,
      state.width * state.height
    );
    for (let i = 0; i < state.pages.byId[id].displayButtons.length; i++) {
      if (
        state.pages.byId[id].displayButtons[i].display
          .isGeneratedFromDefaultBackImage
      ) {
        state.pages.byId[id].displayButtons[i].display = cloneDeep(
          state.defaultBackDisplay
        );
      } else {
        state.pages.byId[id].displayButtons[i].display =
          await generateAdditionalImagery(
            state.pages.byId[id].displayButtons[i].display
          );
      }
    }
    const alreadyDownloaded = !!state.pages.sorted.find((pid) => pid === id);
    if (!alreadyDownloaded) state.pages.sorted.push(id);
    return saveConfigToLocalStorage(state);
  },
  async renamePage(state: ConfigState, { pageId, name }) {
    state.pages.byId[pageId].name = name;
    return saveConfigToLocalStorage(state);
  },
  async changePageWindowName(state: ConfigState, { pageId, windowName }) {
    state.pages.byId[pageId].windowName = windowName;
    return saveConfigToLocalStorage(state);
  },
  async setUsePageName(state, { pageId, value }) {
    state.pages.byId[pageId].usePageNameAsWindowName = value;
    return saveConfigToLocalStorage(state);
  },
  async switchPages(state, data) {
    const { pageAId, pageBId } = data;
    const aIndex = state.pages.sorted.findIndex((pId) => pId === pageAId);
    const bIndex = state.pages.sorted.findIndex((pId) => pId === pageBId);
    if (
      state.pages.byId[pageAId].isInCollection ===
        state.pages.byId[pageBId].isInCollection &&
      !!state.pages.byId[pageAId].isInCollection
    ) {
      const colId = state.pages.byId[pageAId].isInCollection!;
      const aIndex = state.collections.byId[colId].pages.findIndex(
        (pId) => pId === pageAId
      );
      const bIndex = state.collections.byId[colId].pages.findIndex(
        (pId) => pId === pageBId
      );
      state.collections.byId[colId].pages[aIndex] = pageBId;
      state.collections.byId[colId].pages[bIndex] = pageAId;
    }
    state.pages.sorted[aIndex] = pageBId;
    state.pages.sorted[bIndex] = pageAId;
    return saveConfigToLocalStorage(state);
  },
  async deleteDisplayButton(state, { pageId, buttonIndex }) {
    state.pages.byId[pageId].displayButtons[buttonIndex] =
      await createDefaultDisplayButton();
    return saveConfigToLocalStorage(state);
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
    return saveConfigToLocalStorage(state);
  },
  async setPagePublished(state, { pageId, forkedId }) {
    if (!client) {
      window.advancedAlert(
        "Problem with connection to server",
        "We could not reach the FreeDeck Hub server"
      );
      return { ...state };
    }
    if (forkedId) {
      const newState = cloneDeep(state);
      newState.pages.sorted = [
        ...state.pages.sorted.map((pid) => (pid === forkedId ? pageId : pid)),
      ];
      delete newState.pages.byId[forkedId];
      return saveConfigToLocalStorage(
        await configReducer.downloadPage({ ...newState }, { id: pageId })
      );
    } else {
      const response = await client?.query<PageQuery, PageQueryVariables>({
        query: PageDocument,
        variables: { id: pageId },
        fetchPolicy: "network-only",
      });
      state.pages.byId[pageId] = {
        ...cloneDeep(response.data.page.data as Page),
        publishData: {
          createdBy: response.data.page.createdBy.id,
          forkedFrom: response.data.page.forkedFrom?.id,
        },
      };
      return saveConfigToLocalStorage(state);
    }
  },
  async setPageCollection(state, { pageId, collectionId }) {
    const collection = state.collections.byId[collectionId];
    if (!state.pages.byId[pageId].isInCollection) {
      if (collection.pages.length === 0 && !collection.windowName)
        collection.windowName = state.pages.byId[pageId].windowName;
      if (collection.pages.length === 0 && !collection.name)
        collection.name = state.pages.byId[pageId].name;
      collection.pages.push(pageId);
      state.pages.byId[pageId].isInCollection = collectionId;
    } else {
      const colId = state.pages.byId[pageId].isInCollection!;
      state.collections.byId[colId].pages = [
        ...state.collections.byId[colId].pages.filter((pid) => pid !== pageId),
      ];
      state.pages.byId[pageId].isInCollection = undefined;
    }
    return saveConfigToLocalStorage(state);
  },
  async createCollection(state: ConfigState) {
    const newId = v4();
    state.collections.byId[newId] = {
      pages: [],
      useCollectionNameAsWindowName: true,
    };
    state.collections.sorted.push(newId);
    return saveConfigToLocalStorage(state);
  },
  async deleteCollection(state: ConfigState, { collectionId }) {
    state.collections.byId[collectionId].pages.forEach(
      (pageId) => (state.pages.byId[pageId].isInCollection = undefined)
    );
    delete state.collections.byId[collectionId];
    state.collections.sorted = [
      ...state.collections.sorted.filter((cid) => cid !== collectionId),
    ];
    return saveConfigToLocalStorage(state);
  },
  async setUseCollectionName(state, { collectionId, value }) {
    state.collections.byId[collectionId].useCollectionNameAsWindowName = value;
    return saveConfigToLocalStorage(state);
  },
  async renameCollection(state, { collectionId, name }) {
    state.collections.byId[collectionId].name = name;
    return saveConfigToLocalStorage(state);
  },
  async changeCollectionWindowName(state, { collectionId, windowName }) {
    state.collections.byId[collectionId].windowName = windowName;
    return saveConfigToLocalStorage(state);
  },
  async setButtonSettings(state, data) {
    const { pageId, buttonIndex, priOrSec, buttonSettings } = data;
    state.pages.byId[pageId].displayButtons[buttonIndex].button[priOrSec] =
      buttonSettings;
    return saveConfigToLocalStorage(state);
  },
  async setLeavePage(state, { pageId, buttonIndex, targetPageId, enabled }) {
    state.pages.byId[pageId].displayButtons[buttonIndex].button.leavePage = {
      pageId: targetPageId,
      enabled,
    };
    return saveConfigToLocalStorage(state);
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
      return saveConfigToLocalStorage(
        await configReducer.updateAllDefaultBackImages(state)
      );
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
    return saveConfigToLocalStorage(state);
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
      return saveConfigToLocalStorage(
        cloneDeep(await configReducer.updateAllDefaultBackImages(state))
      );
    }
    return saveConfigToLocalStorage(state);
  },
  async deleteImage(state, data) {
    const { buttonIndex, pageId } = data;
    delete state.pages.byId[pageId].displayButtons[buttonIndex].display
      .originalImage;
    state.pages.byId[pageId].displayButtons[buttonIndex].display =
      await generateAdditionalImagery(
        state.pages.byId[pageId].displayButtons[buttonIndex].display
      );
    return saveConfigToLocalStorage(state);
  },
  async switchButtons(state, data) {
    const { pageAId, pageBId, buttonAIndex, buttonBIndex } = data;
    const tempA = state.pages.byId[pageAId].displayButtons[buttonAIndex];
    state.pages.byId[pageAId].displayButtons[buttonAIndex] = cloneDeep(
      state.pages.byId[pageBId].displayButtons[buttonBIndex]
    );
    state.pages.byId[pageBId].displayButtons[buttonBIndex] = cloneDeep(tempA);
    return saveConfigToLocalStorage(state);
  },
  async copyButton(state, data) {
    const { pageSrcId, pageDestId, buttonSrcIndex, buttonDestIndex } = data;
    state.pages.byId[pageDestId].displayButtons[buttonDestIndex] = cloneDeep(
      state.pages.byId[pageSrcId].displayButtons[buttonSrcIndex]
    );
    return saveConfigToLocalStorage(state);
  },
  async updateAllDefaultBackImages(state) {
    Object.entries(state.pages.byId).forEach(([pageId, page]) => {
      page.displayButtons.forEach((displayButton, displayIndex) => {
        if (displayButton.display.isGeneratedFromDefaultBackImage)
          state.pages.byId[pageId].displayButtons[displayIndex].display =
            cloneDeep(state.defaultBackDisplay);
      });
    });
    return saveConfigToLocalStorage(state);
  },
  async makeDefaultBackButton(state, data) {
    const { buttonIndex, pageId } = data;
    state.pages.byId[pageId].displayButtons[buttonIndex].display =
      state.defaultBackDisplay;
    return saveConfigToLocalStorage(state);
  },
  async resetDefaultBackButton(state) {
    state.defaultBackDisplay = await createDefaultBackDisplay("dbd");
    return saveConfigToLocalStorage(state);
  },
  async setState(state, newState) {
    return saveConfigToLocalStorage(newState);
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
