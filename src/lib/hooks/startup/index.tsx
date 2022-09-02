import { MutableRefObject, useRef } from "react";

import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { IConfigDispatch } from "../../../states/configState";
import { useLiveData } from "./liveData";
import { usePageSwitcher } from "./pageSwitcher";
import { usePersistentConfig } from "./persistentConfig";
import { useSerialCommand } from "./serialCommand";
import { useSystemInfo } from "./systemInfo";

export type RefState = MutableRefObject<Map<string, any>>;
export const useStartupHooks = (
  configState: Config,
  configDispatch: IConfigDispatch,
  appState: AppState,
  appDispatch: IAppDispatch
) => {
  usePersistentConfig(configDispatch, appDispatch);
  usePageSwitcher(configState, appState);

  const refData = useRef<Map<string, any>>(new Map());
  useSerialCommand(configState, appState, appDispatch, refData);
  useSystemInfo(configState, appDispatch, refData);
  useLiveData(configState, appState, refData);
};
