import { MutableRefObject, useRef } from "react";

import { RefState, StateRef } from "../../../App";
import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { IConfigDispatch } from "../../../states/configState";
import { useOnce } from "../once";
import { useLiveData } from "./liveData";
import { usePageSwitcher } from "./pageSwitcher";
import { usePersistentConfig } from "./persistentConfig";
import { useSerialCommand } from "./serialCommand";
import { useSystemInfo } from "./systemInfo";

export const useBackgroundTasks = (
  configState: Config,
  configDispatch: IConfigDispatch,
  appState: AppState,
  appDispatch: IAppDispatch,
  refState: StateRef
) => {
  usePersistentConfig(configDispatch, appDispatch);
  usePageSwitcher(configState, appState);

  useSerialCommand(configState, appState, appDispatch, refState);
  useSystemInfo(configState, appDispatch, refState);
  useLiveData(configState, appState, refState);
};
