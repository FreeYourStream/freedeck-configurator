import { Config } from "../../generated";
import { handleFileSelect } from "../file/handleFileSelect";
import { parseConfig } from "./parseConfig";
const isBuffer = (data: Buffer | FileList): data is Buffer => {
  return !!(data as Buffer).byteLength;
};
export const loadConfigFile = async (
  fileList: FileList | Buffer,
  setState: (newState: Config) => any
) => {
  const file = isBuffer(fileList)
    ? fileList
    : Buffer.from(await handleFileSelect(fileList[0]));

  try {
    const config = await parseConfig(file);
    setState(config);
  } catch (e: any) {
    window.advancedAlert("Invalid config File", (e as Error).message);
  }
};
