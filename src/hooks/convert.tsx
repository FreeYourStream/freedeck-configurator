import { useState } from "react";
import { composeImage, IConverted } from "../lib/convertFile";
import { isUndefined } from "util";
import { handleFileSelect } from "../lib/fileSelect";

export const useConvert = (
  file?: File,
  contrast?: number,
  invert?: boolean,
  dither?: boolean
) => {
  const [state, setState] = useState<Buffer>();
  if (file && contrast && !isUndefined(invert) && !isUndefined(dither)) {
    handleFileSelect(file)
      .then(arrayBuffer =>
        composeImage(arrayBuffer, 128, 64, contrast, invert, dither)
      )
      .then(imageString => setState(imageString));
  }
  return state;
};
