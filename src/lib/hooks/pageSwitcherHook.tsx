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
      if (name.toLowerCase().indexOf(page.windowName.toLowerCase()) !== -1) {
        return i;
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
      if (name.toLowerCase().indexOf(col.windowName.toLowerCase())) {
        return i;
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
    console.log("windowName", windowName);
    console.log("DEBUG", 1);
    let pageIndex = findPage(configState, windowName);
    if (pageIndex === -1) {
      console.log("DEBUG", 2);
      const collectionIndex = findCollectionPage(configState, windowName);
      if (collectionIndex === -1) return;
      console.log("DEBUG", 3);
      const currentPageIndex = await appState.serialApi?.getCurrentPage();
      if (currentPageIndex === undefined) return;
      console.log("DEBUG", 4);
      const currentPageId = configState.pages.sorted[currentPageIndex];
      const collection =
        configState.collections.byId[
          configState.collections.sorted[collectionIndex]
        ];
      if (collection.pages.includes(currentPageId)) return;
      console.log("DEBUG", 5);
      const pageFoundIndex = configState.pages.sorted.findIndex(
        (id) => id === collection.pages[0]
      );
      if (pageFoundIndex === -1) return;
      console.log("DEBUG", 6);
      console.log("switching to page", pageFoundIndex);
      // if (lastPageTimeout) clearInterval(lastPageTimeout);
      // lastPageSent = pageFoundIndex;
      // lastPageTimeout = setTimeout(() => {
      //   if (appState.autoSwitchBackPageTimeout) lastPageSent = -1;
      // }, appState.autoSwitchBackPageTimeout) as unknown as number;
      appState.serialApi?.setCurrentPage(pageFoundIndex);
    } else {
    }

    // if (pageIndex + 1 || collection) {
    //   const currentPageString = await appState.serialApi?.getCurrentPage();
    //   if (currentPageString === undefined) return;
    //   const currentPageIndex = parseInt(currentPageString);
    //   if (pageIndex + 1) {
    //     if (currentPageIndex !== pageIndex && pageIndex !== lastPageSent) {
    //       appState.serialApi?.setCurrentPage(pageIndex);
    //       lastPageSent = pageIndex;
    //     }
    //   } else if (collection) {
    //     const currentId = configState.pages.sorted[currentPageIndex];
    //     if (!collection.pages.includes(currentId)) {
    //       const firstCollectionPage = configState.pages.sorted.findIndex(
    //         (pid) => pid === collection.pages[0]
    //       );
    //       if (firstCollectionPage !== lastPageSent) {
    //         appState.serialApi?.setCurrentPage(firstCollectionPage);
    //         lastPageSent = firstCollectionPage;
    //       }
    //     }
    //   }
    // }
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
