import type { IpcRenderer } from "electron";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { AppState } from "../../states/appState";
import { ConfigState } from "../../states/configState";
import { isElectron } from "../electron";

let lastPageIndex = 0;
export const usePageSwitcher = (props: {
  configState: ConfigState;
  appState: AppState;
}) => {
  const location = useLocation();
  useEffect(() => {
    if (!isElectron()) return () => {};
    if (location.pathname !== "/") return () => {};
    const ipc = (window as any).ipcRenderer as IpcRenderer;
    const callback: (event: Electron.IpcRendererEvent, name: string) => void = (
      event,
      name
    ) => {
      // check if we have a page that looks for this window name
      let page = props.configState.pages.sorted.findIndex((id) => {
        const page = props.configState.pages.byId[id];
        if (!page.windowName || page.isInCollection) return false;
        return name.toLowerCase().indexOf(page.windowName.toLowerCase()) !== -1;
      });
      // if no, look if we have a collection
      if (page === -1) {
        const collectionIndex = props.configState.collections.sorted.findIndex(
          (id) => {
            const collection = props.configState.collections.byId[id];
            if (!collection.windowName) return false;
            return (
              name
                .toLowerCase()
                .indexOf(collection.windowName.toLowerCase()) !== -1
            );
          }
        );
        // if we found a collection, check if a page of this collection is currently active
        if (collectionIndex !== -1) {
          const collectionId =
            props.configState.collections.sorted[collectionIndex];
          const collection = props.configState.collections.byId[collectionId];
          if (
            collection.pages.indexOf(
              props.configState.pages.sorted[lastPageIndex]
            ) === -1
          )
            page = props.configState.pages.sorted.findIndex(
              (pid) => pid === collection.pages[0]
            );
        }
      }
      if (page >= 0 && page !== lastPageIndex) {
        lastPageIndex = page;
        props.appState.serialApi?.setCurrentPage(page);
      }
    };
    ipc.on("change_page", callback);
    return () => ipc.off("change_page", callback);
  }, [props.configState, props.appState, location]);
};
