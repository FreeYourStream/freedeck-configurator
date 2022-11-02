import { invoke } from "@tauri-apps/api";

import { RefState, StateRef } from "../../App";
import { Config } from "../../generated";
import { IAppDispatch } from "../../states/appState";

const pressKeys = (args: number[], configState: Config) => {
  const pageId = configState.pages.sorted[args[0]];
  const button = configState.pages.byId[pageId].displayButtons[args[1]].button;
  const text = args[2]
    ? button.secondary.values.text
    : button.primary.values.text;
  invoke("press_keys", { keyString: text ?? "nothing" });
};

export const saveCurrentPage = (
  result: number,
  appDispatch: IAppDispatch,
  stateRef: StateRef
) => {
  let data: RefState["deck"];
  if (result < 0) {
    data = {
      currentPage: Math.abs(result + 1),
      dontSwitchPage: true,
    };
  } else if (result >= 0) {
    data = { currentPage: result, dontSwitchPage: false };
  } else {
    data = { currentPage: null, dontSwitchPage: false };
  }
  stateRef.current.deck = data;
  appDispatch.setDeck(data);
};

export const runCommand = (
  command: number,
  args: number[],
  configState: Config,
  appDispatch: IAppDispatch,
  refData: StateRef
) => {
  switch (command) {
    case 0x10:
      pressKeys(args, configState);
      break;
    case 0x20:
      saveCurrentPage(args[0], appDispatch, refData);
      break;
  }
};
