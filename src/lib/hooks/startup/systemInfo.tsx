import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";

import { StateRef } from "../../../App";
import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { timeout } from "../../misc/util";

export const useSystemInfo = (
  configState: Config,
  appDispatch: IAppDispatch,
  refData: StateRef
) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: number | undefined;

    const startListen = async () => {
      await timeout(250);
      if (isCancelled) return;

      unlistenSerialCommand = setInterval(async () => {
        const temps = await invoke<{ cpuTemp: number; gpuTemp: number }>(
          "get_temps"
        );
        refData.current.system = temps;
        appDispatch.setTemps(temps);
      }, 100) as unknown as number;
    };

    startListen();

    return () => {
      isCancelled = true;
      clearInterval(unlistenSerialCommand);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appDispatch]);
};
