import type { IpcRenderer } from "electron";
import { useEffect } from "react";

import { AppState } from "../../states/appState";
import { ConfigState } from "../../states/configState";
import { isElectron } from "../electron";

let lastPageIndex = 0;
export const usePageSwitcher = (props: {
  configState: ConfigState;
  appState: AppState;
}) => {
  useEffect(() => {
    if (!isElectron()) return () => {};
    const ipc = (window as any).ipcRenderer as IpcRenderer;
    const callback: (event: Electron.IpcRendererEvent, name: string) => void = (
      event,
      name
    ) => {
      const page = Object.entries(props.configState.pages.byId).findIndex(
        ([id, page]) => {
          if (page.name === "") return false;
          return name.toLowerCase().indexOf(page.name.toLowerCase()) !== -1;
        }
      );
      // console.log(page, lastPageIndex);
      if (page >= 0 && page !== lastPageIndex) {
        lastPageIndex = page;
        console.log("FOUND", page);
        props.appState.serialApi?.setCurrentPage(page);
      }
    };
    ipc.on("change_page", callback);
    return () => ipc.off("change_page", callback);
  }, [props.configState, props.appState]);
};
