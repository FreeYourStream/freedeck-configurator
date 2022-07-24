import { FC, useContext, useEffect } from "react";

import { AppDispatchContext } from "../../states/appState";
import { ConfigDispatchContext } from "../../states/configState";
import { convertCurrentConfig } from "../configFile/parseConfig";

export const StartUp: FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const appDispatch = useContext(AppDispatchContext);
  useEffect(() => {
    (async () => {
      const config = localStorage.getItem("config");
      if (config) {
        const converted = await convertCurrentConfig(JSON.parse(config));
        configDispatch.setState(converted);
      }
      if ((window as any).__TAURI_IPC__) {
        const value = localStorage.getItem("autoPageSwitcherEnabled");
        const autoPageSwitcherEnabled =
          value === null ? true : JSON.parse(value);
        appDispatch.toggleAutoPageSwitcher(autoPageSwitcherEnabled);
        const { listen } = await import("@tauri-apps/api/event");
        listen("toggle_aps", (data) => {
          appDispatch.toggleAutoPageSwitcher(undefined);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
