import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

import { IAppDispatch } from "../../../states/appState";
import { IConfigDispatch } from "../../../states/configState";
import { convertCurrentConfig } from "../../configFile/parseConfig";

export const usePersistentConfig = (
  configDispatch: IConfigDispatch,
  appDispatch: IAppDispatch
) => {
  useEffect(() => {
    const handleStartup = async () => {
      const config = localStorage.getItem("config");

      if (config) {
        const parsed = JSON.parse(config);
        const converted = await convertCurrentConfig(parsed);
        configDispatch.setState(converted);
      }

      if (!(window as any).__TAURI_IPC__) return;

      const value = localStorage.getItem("autoPageSwitcherEnabled");
      const autoPageSwitcherEnabled = value === null ? true : JSON.parse(value);

      appDispatch.toggleAutoPageSwitcher(autoPageSwitcherEnabled);

      await listen("toggle_aps", (data) => {
        appDispatch.toggleAutoPageSwitcher(undefined);
      });
    };

    handleStartup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
