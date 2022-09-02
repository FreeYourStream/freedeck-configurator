import { useEffect } from "react";

import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { timeout } from "../../misc/util";
import { RefState } from ".";

export const convertData = (result: number) => {
  if (result < 0) {
    const data = {
      currentPage: Math.abs(result + 1),
      dontSwitchPage: true,
    };
    return data;
  } else if (result >= 0) {
    const data = { currentPage: result, dontSwitchPage: false };
    return data;
  }
  return { currentPage: null, dontSwitchPage: false };
};

export const usePollPage = (
  configState: Config,
  appState: AppState,
  appDispatch: IAppDispatch,
  refData: RefState
) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;
    let isCancelled = false;
    let unlisten: number;

    const startListen = async () => {
      await timeout(250);
      if (isCancelled) return;

      unlisten = setInterval(async () => {
        const result = await appState.serialApi?.getCurrentPage();
        if (result === undefined) return;
        const data = convertData(result);
        if (
          data &&
          data.currentPage === refData.current.get("deck")?.currentPage &&
          data.dontSwitchPage === refData.current.get("deck")?.dontSwitchPage
        )
          return;
        refData.current.set("deck", data);
        appDispatch.setDeck(data);
      }, 250) as unknown as number;
    };

    startListen();

    return () => {
      isCancelled = true;
      clearTimeout(unlisten);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appState.serialApi]);
};
