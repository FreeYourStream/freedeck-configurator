import { invoke } from "@tauri-apps/api";

import { ConfigState } from "../../states/configState";

const pressKeys = (args: number[], configState: ConfigState) => {
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
  configState: ConfigState
) => {
  if (command === 16) pressKeys(args, configState);
};
