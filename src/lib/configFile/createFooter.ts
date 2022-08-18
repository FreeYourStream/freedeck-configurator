import { cloneDeep } from "lodash";
import { deflate } from "pako";

import { Config } from "../../generated";

export const slimConfig = (state: Config) => {
  let slimState = cloneDeep(state);
  for (let i = 0; i < slimState.pages.sorted.length; i++) {
    const id = slimState.pages.sorted[i];
    const page = slimState.pages.byId[id];
    for (const button of page.displayButtons) {
      delete (button.display as any).convertedImage;
      delete (button.display as any).previewImage;
    }
  }
  return slimState;
};

export const createFooter = (state: Config): Buffer => {
  //save this at the end of the config
  let slimState = slimConfig(state);
  let slimString = JSON.stringify(slimState);
  let deflated = deflate(slimString);
  return Buffer.from(deflated);
};
