import { State } from "../../state";

export const createFooter = (state: State) => {
  //save this at the end of the config
  return Buffer.from(JSON.stringify(state), "binary");
};
