import { useEffect } from "react";

import { StateRef } from "../../../App";
import { Config } from "../../../generated";
import { AppState } from "../../../states/appState";

const updateLiveDisplays = async (
  configState: Config,
  appState: AppState,
  refData: StateRef
) => {
  let deck = refData.current.deck;
  if (deck === undefined || deck.dontSwitchPage || deck.currentPage === null)
    return;
  const pageId = configState.pages.sorted[deck.currentPage];
  const page = configState.pages.byId[pageId];
  if (!page) return;
  if (!appState.serialApi?.connected) return;
  let dbIndex = 0;
  for (const db of page.displayButtons) {
    if (db.live) {
      if (db.live === "cpu_temp")
        await appState.serialApi
          ?.writeToScreen(
            `CPU: ${refData.current.system.cpuTemp.toFixed(0)}C`,
            dbIndex
          )
          .catch(() => {});
      if (db.live === "gpu_temp")
        await appState.serialApi
          ?.writeToScreen(
            `GPU: ${refData.current.system.gpuTemp.toFixed(0)}C`,
            dbIndex
          )
          .catch(() => {});
      if (db.live === "cpu_gpu_temp")
        await appState.serialApi
          ?.writeToScreen(
            `CPU: ${refData.current.system.cpuTemp.toFixed(0)}C
GPU: ${refData.current.system.gpuTemp.toFixed(0)}C`,
            dbIndex
          )
          .catch(() => {});
    }
    dbIndex++;
  }
};
export const useLiveData = (
  configState: Config,
  appState: AppState,
  refData: StateRef
) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: number | undefined;
    const startListen = async () => {
      if (isCancelled) return;
      updateLiveDisplays(configState, appState, refData);
      unlistenSerialCommand = setInterval(async () => {
        updateLiveDisplays(configState, appState, refData);
      }, 1000) as unknown as number;
    };

    startListen();

    return () => {
      isCancelled = true;
      clearInterval(unlistenSerialCommand);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appState.serialApi, appState.deck]);
};
