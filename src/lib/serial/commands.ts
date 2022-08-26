import { invoke } from "@tauri-apps/api";

import { Config } from "../../generated";

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
  configState: Config
) => {
  if (command === 16) pressKeys(args, configState);
};
