import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";

import { Config } from "../../../generated";
import { AppState } from "../../../states/appState";
import { timeout } from "../../misc/util";

export const useSystemInfo = (configState: Config, appState: AppState) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: number | undefined;

    const startListen = async () => {
      await timeout(250);
      if (isCancelled) return;

      unlistenSerialCommand = setInterval(async () => {
        const temp = await invoke<number>("get_cpu_temp");
        // appState.serialApi?.writeToScreen(`CPU: ${temp.toFixed(0)}C`);
        // appDispatch.setCPUTemp();
      }, 1000) as unknown as number;
    };

    startListen();

    return () => {
      isCancelled = true;
      clearInterval(unlistenSerialCommand);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appState]);
};
