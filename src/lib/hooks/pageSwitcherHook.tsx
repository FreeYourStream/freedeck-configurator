import { useEffect } from "react";
import * as workerInterval from "worker-interval";

import { AppState } from "../../states/appState";
import { ConfigState } from "../../states/configState";

let lastWindowName = "";
const findPage = (configState: ConfigState, name: string): number => {
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
        .split(",")
        .map((s) => s.trim().toLowerCase());
      for (const windowName of windowNames) {
        if (name.toLowerCase().indexOf(windowName) !== -1) return i;
      }
    }
  }
  return -1;
};
const findCollectionPage = (configState: ConfigState, name: string): number => {
  for (let i = 0; i < configState.collections.sorted.length; i++) {
    const col = configState.collections.byId[configState.collections.sorted[i]];
    if (col.usePageNameAsWindowName) {
      if (!col.name) continue;
      if (name.toLowerCase().indexOf(col.name.toLowerCase())) {
        return i;
      }
    } else {
      if (!col.windowName) continue;
      const windowNames = col.windowName
        .split(",")
        .map((s) => s.trim().toLowerCase());
      for (const windowName of windowNames) {
        if (name.toLowerCase().indexOf(windowName) !== -1) return i;
      }
    }
  }
  return -1;
};

const run = async (configState: ConfigState, appState: AppState) => {
  try {
    const res = await fetch("http://localhost:8000/current_window");
    if (!res.ok) return false;
    let windowName = await res.text();
    if (windowName === lastWindowName) return;
    lastWindowName = windowName;
    let pageIndex = findPage(configState, windowName);
    if (pageIndex === -1) {
      const collectionIndex = findCollectionPage(configState, windowName);
      if (collectionIndex === -1) return;
      const currentPageIndex = await appState.serialApi?.getCurrentPage();
      if (currentPageIndex === undefined) return;
      const currentPageId = configState.pages.sorted[currentPageIndex];
      const collection =
        configState.collections.byId[
          configState.collections.sorted[collectionIndex]
        ];
      if (collection.pages.includes(currentPageId)) return;
      const pageFoundIndex = configState.pages.sorted.findIndex(
        (id) => id === collection.pages[0]
      );
      if (pageFoundIndex === -1) return;
      appState.serialApi?.setCurrentPage(pageFoundIndex);
    } else {
      const currentPageIndex = await appState.serialApi?.getCurrentPage();
      if (currentPageIndex === undefined || currentPageIndex === pageIndex)
        return;
      appState.serialApi?.setCurrentPage(pageIndex);
    }
  } catch {
    console.log("error, companion probably not running");
  }
};

export const usePageSwitcher = (props: {
  configState: ConfigState;
  appState: AppState;
}) => {
  const { configState, appState } = props;
  useEffect(() => {
    if (!(navigator as any).serial) return () => {};
    let running = false;
    const interval = workerInterval.setInterval(async () => {
      if (!running) {
        running = true;
        await run(configState, appState);
        running = false;
      }
    }, 300);
    return () => {
      console.log("clearing interval", interval);
      if (interval) workerInterval.clearInterval(interval);
    };
  }, [configState, appState.serialApi]);
};
