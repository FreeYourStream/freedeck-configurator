import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

import { StateRef } from "../../../App";
import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { sleep } from "../../misc/util";
import { runCommand } from "../../serial/commands";

export const useSerialCommand = (
  configState: Config,
  appState: AppState,
  appDispatch: IAppDispatch,
  refData: StateRef
) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: UnlistenFn | undefined;

    const startListen = async () => {
      await sleep(250);
      if (isCancelled) return;

      unlistenSerialCommand = await listen<null>("serial_command", async () => {
        const { command, args } = await appState.serialApi!.readSerialCommand();
        runCommand(command, args, configState, appDispatch, refData);
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
