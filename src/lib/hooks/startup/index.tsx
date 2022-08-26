import { Config } from "../../../generated";
import { AppState, IAppDispatch } from "../../../states/appState";
import { IConfigDispatch } from "../../../states/configState";
import { usePageSwitcher } from "./pageSwitcher";
import { usePersistentConfig } from "./persistentConfig";
import { useSerialCommand } from "./serialCommand";

export const useStartupHooks = (
  configState: Config,
  configDispatch: IConfigDispatch,
  appState: AppState,
  appDispatch: IAppDispatch
) => {
  usePersistentConfig(configDispatch, appDispatch);
  useSerialCommand(configState, appState);
  usePageSwitcher(configState, appState);
};
