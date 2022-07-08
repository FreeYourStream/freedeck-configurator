import { ConfigState } from "../../states/configState";

export const createFooter = (state: ConfigState) => {
  //save this at the end of the config
  return Buffer.from(JSON.stringify(state), "binary");
};
