import { Config } from "../../generated";

export const createFooter = (state: Config) => {
  //save this at the end of the config
  return Buffer.from(JSON.stringify(state), "utf-8");
};
