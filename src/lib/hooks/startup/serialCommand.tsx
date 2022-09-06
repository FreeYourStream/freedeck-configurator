import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

import { StateRef } from "../../../App";
import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { timeout } from "../../misc/util";
import { runCommand } from "../../serial/commands";

export const useSerialCommand = (
  configState: Config,
  appState: AppState,
  appDispatch: IAppDispatch,
  refData: StateRef
) => {
  useEffect(() => {
    let isCancelled = false;

    const startListen = async () => {
      await timeout(250);
      if (isCancelled) return;
      appState.serialApi?.setCommandCallback(async (serial) => {
        const { command, args } = await serial.readSerialCommand();
        runCommand(command, args, configState, appDispatch, refData);
      });
    };

    startListen();

    return () => {
      isCancelled = true;
      appState.serialApi?.setCommandCallback(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState]);
};
