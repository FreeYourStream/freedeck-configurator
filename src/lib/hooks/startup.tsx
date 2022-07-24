import { FC, useContext, useEffect } from "react";

import { AppDispatchContext, AppStateContext } from "../../states/appState";
import { ConfigDispatchContext } from "../../states/configState";
import { convertCurrentConfig } from "../configFile/parseConfig";

export const StartUp: FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const appDispatch = useContext(AppDispatchContext);
  const appState = useContext(AppStateContext);
  useEffect(() => {
    (async () => {
      const config = localStorage.getItem("config");
      if (config) {
        const converted = await convertCurrentConfig(JSON.parse(config));
        configDispatch.setState(converted);
      }
      if ((window as any).__TAURI_IPC__) {
        const { listen } = await import("@tauri-apps/api/event");
        listen("toggle_aps", (data) => {
          appDispatch.setAutoPageSwitcher(!appState.autoPageSwitcherEnabled);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
