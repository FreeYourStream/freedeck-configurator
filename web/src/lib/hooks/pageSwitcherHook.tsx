import type { IpcRenderer } from "electron";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { AppState } from "../../states/appState";
import { ConfigState } from "../../states/configState";
import { isElectron } from "../electron";

const findPage = (configState: ConfigState, name: string) => {
  return configState.pages.sorted.findIndex((id) => {
    const page = configState.pages.byId[id];
    if (page.isInCollection) return false;
    if (page.usePageNameAsWindowName) {
      if (!page.name) return false;
      return name.toLowerCase().indexOf(page.name.toLowerCase()) !== -1;
    } else {
      if (!page.windowName) return false;
      return name.toLowerCase().indexOf(page.windowName.toLowerCase()) !== -1;
    }
  });
};
const findCollectionPage = (configState: ConfigState, name: string) => {
  return Object.values(configState.collections.byId).find((col) => {
    if (col.usePageNameAsWindowName) {
      if (!col.name) return false;
      return name.toLowerCase().indexOf(col.name.toLowerCase()) !== -1;
    } else {
      if (!col.windowName) return false;
      return name.toLowerCase().indexOf(col.windowName.toLowerCase()) !== -1;
    }
  });
};

export const usePageSwitcher = (props: {
  configState: ConfigState;
  appState: AppState;
}) => {
  const { configState, appState } = props;
  const location = useLocation();
  useEffect(() => {
    if (!isElectron()) return () => {};
    if (location.pathname !== "/") return () => {};
    const ipc = (window as any).ipcRenderer as IpcRenderer;
    const callback: (event: Electron.IpcRendererEvent, name: string) => void = (
      event,
      name
    ) => {
      (async () => {
        // check if we have a page that looks for this window name
        let page = findPage(configState, name);
        // if no, look if we have a collection
        const collection =
          page !== -1 ? findCollectionPage(configState, name) : undefined;
        if (page + 1 || collection) {
          const currentPageString = await appState.serialApi?.getCurrentPage();
          if (currentPageString === undefined) return;
          const currentPageIndex = parseInt(currentPageString);
          if (page + 1) {
            if (currentPageIndex !== page)
              appState.serialApi?.setCurrentPage(page);
          } else if (collection) {
            const currentId = configState.pages.sorted[currentPageIndex];
            if (!collection.pages.includes(currentId)) {
              const firstCollectionPage = configState.pages.sorted.findIndex(
                (pid) => pid === collection.pages[0]
              );
              appState.serialApi?.setCurrentPage(firstCollectionPage);
            }
          }
        }
      })();
    };
    ipc.on("change_page", callback);
    return () => ipc.off("change_page", callback);
  }, [configState, appState, location]);
};
