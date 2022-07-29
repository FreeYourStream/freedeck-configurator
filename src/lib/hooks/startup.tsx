import { invoke } from "@tauri-apps/api";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { FC, useContext, useEffect } from "react";

import { AppDispatchContext, AppStateContext } from "../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { convertCurrentConfig } from "../configFile/parseConfig";

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const StartUp: FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const configState = useContext(ConfigStateContext);
  const appDispatch = useContext(AppDispatchContext);
  const appState = useContext(AppStateContext);
  useEffect(() => {
    const handleStartup = async () => {
      const config = localStorage.getItem("config");
      if (config) {
        const converted = await convertCurrentConfig(JSON.parse(config));
        configDispatch.setState(converted);
      }
      if (!(window as any).__TAURI_IPC__) return;
      const value = localStorage.getItem("autoPageSwitcherEnabled");
      const autoPageSwitcherEnabled = value === null ? true : JSON.parse(value);
      appDispatch.toggleAutoPageSwitcher(autoPageSwitcherEnabled);
      const { listen } = await import("@tauri-apps/api/event");
      await listen("toggle_aps", (data) => {
        appDispatch.toggleAutoPageSwitcher(undefined);
      });
    };
    handleStartup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;
    let isCancelled = false;
    let unlistenSerialCommand: UnlistenFn | undefined;
    const startListen = async () => {
      await timeout(250);
      if (!isCancelled) {
        unlistenSerialCommand = await listen<null>(
          "serial_command",
          async () => {
            const { command, args } =
              await appState.serialApi!.readSerialCommand();
            if (command === 16) {
              const pageId = configState.pages.sorted[args[0]];
              const button =
                configState.pages.byId[pageId].displayButtons[args[1]].button;
              const text = args[2]
                ? button.secondary.values.text
                : button.primary.values.text;
              invoke("press_keys", { keyString: text ?? "nothing" });
            }
          }
        );
      }
    };
    startListen();
    return () => {
      isCancelled = true;
      unlistenSerialCommand?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState]);
  return <></>;
};
