import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";
import * as workerInterval from "worker-interval";

import { Config } from "../../../generated";
import { AppState } from "../../../states/appState";

let lastWindowName = "";

const findPage = (configState: Config, name: string): number => {
  for (let i = 0; i < configState.pages.sorted.length; i++) {
    const page = configState.pages.byId[configState.pages.sorted[i]];
    if (page.isInCollection) continue;
    if (page.usePageNameAsWindowName) {
      if (!page.name) continue;
      if (name.toLowerCase().indexOf(page.name.toLowerCase()) !== -1) {
        return i;
      }
    } else {
      if (!page.windowName) continue;
      const windowNames = page.windowName
        .split(/[,\n]/)
        .map((s) => s.trim().toLowerCase());
      for (const windowName of windowNames) {
        if (name.toLowerCase().indexOf(windowName) !== -1) return i;
      }
    }
  }
  return -1;
};
const findCollectionPage = (configState: Config, name: string): number => {
  for (let i = 0; i < configState.collections.sorted.length; i++) {
    const col = configState.collections.byId[configState.collections.sorted[i]];
    if (col.useCollectionNameAsWindowName) {
      if (!col.name) continue;
      if (name.toLowerCase().indexOf(col.name.toLowerCase())) {
        return i;
      }
    } else {
      if (!col.windowName) continue;
      const windowNames = col.windowName
        .split(/[,\n]/)
        .map((s) => s.trim().toLowerCase());
      for (const windowName of windowNames) {
        if (name.toLowerCase().indexOf(windowName) !== -1) return i;
      }
    }
  }
  return -1;
};

const switchToPage = async (
  windowName: string,
  pageIndex: number,
  appState: AppState
) => {
  const currentPageIndex = await appState.serialApi?.getCurrentPage();
  if ([undefined, pageIndex].includes(currentPageIndex)) return;
  if (currentPageIndex! < 0) {
    lastWindowName = "";
    return;
  }
  lastWindowName = windowName;
  appState.serialApi?.setCurrentPage(pageIndex);
};

const switchToCollection = async (
  windowName: string,
  configState: Config,
  appState: AppState
) => {
  const collectionIndex = findCollectionPage(configState, windowName);
  if (collectionIndex === -1) return;
  const currentPageIndex = await appState.serialApi?.getCurrentPage();
  if (currentPageIndex === undefined) return;
  if (currentPageIndex < 0) {
    lastWindowName = "";
    return;
  }
  const currentPageId = configState.pages.sorted[currentPageIndex!];
  const collection =
    configState.collections.byId[
      configState.collections.sorted[collectionIndex]
    ];
  if (collection.pages.includes(currentPageId)) return;
  const pageFoundIndex = configState.pages.sorted.findIndex(
    (id) => id === collection.pages[0]
  );
  if (pageFoundIndex === -1) return;
  lastWindowName = windowName;
  appState.serialApi?.setCurrentPage(pageFoundIndex);
};

const switchToPageOrCollection = async (
  configState: Config,
  appState: AppState
) => {
  try {
    let windowName = await invoke<string>("get_current_window");
    if (windowName === lastWindowName) return;
    let pageIndex = findPage(configState, windowName);
    if (pageIndex === -1) {
      await switchToCollection(windowName, configState, appState);
    } else {
      await switchToPage(windowName, pageIndex, appState);
    }
  } catch (e) {
    console.log(e);
  }
};

export const usePageSwitcher = (configState: Config, appState: AppState) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return () => {};

    let running = false;

    const interval = workerInterval.setInterval(async () => {
      if (!running && appState.autoPageSwitcherEnabled) {
        running = true;
        await switchToPageOrCollection(configState, appState);
        running = false;
      }
    }, 80);

    return () => {
      if (interval) workerInterval.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appState.serialApi, appState.autoPageSwitcherEnabled]);
};
