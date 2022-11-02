import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

import { StateRef } from "../../App";
import { AppState, IAppDispatch } from "../../states/appState";
import { saveCurrentPage } from "../serial/commands";

export const useOnce = (
  appState: AppState,
  appDispatch: IAppDispatch,
  stateRef: StateRef
) => {
  const serialApi = appState.serialApi;
  useEffect(() => {
    if ("__TAURI_IPC__" in window) {
      listen<{ cpuTemp: number; gpuTemp: number }>("system_temps", (event) => {
        appDispatch.setTemps(event.payload);
      });
    }
    if (!serialApi) return;
    const portsId = serialApi.registerOnPortsChanged(
      (ports, connectedPortIndex) => {
        appDispatch.setAvailablePorts(ports);
        appDispatch.setConnectedPortIndex(connectedPortIndex);
        appDispatch.setDevLog({
          path: "connectedPortIndex",
          data: connectedPortIndex,
        });
        if (connectedPortIndex > -1) {
          serialApi
            .getHasJson()
            .then((hasJson) => appDispatch.setHasJson(hasJson));
          serialApi.getCurrentPage().then((page) => {
            console.log(page);
            saveCurrentPage(page, appDispatch, stateRef);
          });
        }
      }
    );
    return () => {
      serialApi.clearOnPortsChanged(portsId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
