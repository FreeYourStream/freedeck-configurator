import { invoke } from "@tauri-apps/api";

import { Config } from "../../generated";
import { IAppDispatch } from "../../states/appState";
import { RefState } from "../hooks/startup";
import { convertData } from "../hooks/startup/pollPage";

const pressKeys = (args: number[], configState: Config) => {
  const pageId = configState.pages.sorted[args[0]];
  const button = configState.pages.byId[pageId].displayButtons[args[1]].button;
  const text = args[2]
    ? button.secondary.values.text
    : button.primary.values.text;
  invoke("press_keys", { keyString: text ?? "nothing" });
};

export const runCommand = (
  command: number,
  args: number[],
  configState: Config,
  appDispatch: IAppDispatch,
  refData: RefState
) => {
  if (command === 0x10) pressKeys(args, configState);
  else if (command === 0x20) {
    const data = convertData(args[0]);
    appDispatch.setDeck(data);
    refData.current.set("deck", data);
  }
};
