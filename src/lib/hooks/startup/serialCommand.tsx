import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

import { Config } from "../../../generated";
import { AppState } from "../../../states/appState";
import { timeout } from "../../misc/util";
import { runCommand } from "../../serial/commands";

export const useSerialCommand = (configState: Config, appState: AppState) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: UnlistenFn | undefined;

    const startListen = async () => {
      await timeout(250);
      if (isCancelled) return;

      unlistenSerialCommand = await listen<null>("serial_command", async () => {
        const { command, args } = await appState.serialApi!.readSerialCommand();
        runCommand(command, args, configState);
      });
    };

    startListen();

    return () => {
      isCancelled = true;
      unlistenSerialCommand?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState]);
};
