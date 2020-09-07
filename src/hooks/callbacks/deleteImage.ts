import { useCallback } from "react";

import { IDisplay } from "../../App";
import { getDefaultDisplay } from "../../definitions/defaultPage";

export const useDeleteImageCallback = (
  setDisplaySettings: (
    pageIndex: number,
    displayIndex: number,
    newDisplay: IDisplay
  ) => Promise<void>,
  setOriginalImage: (
    pageIndex: number,
    displayIndex: number,
    image: Buffer | null
  ) => Promise<void>
) =>
  //useCallback(
  async (pageIndex: number, displayIndex: number) => {
    await setOriginalImage(pageIndex, displayIndex, null);
    await setDisplaySettings(pageIndex, displayIndex, getDefaultDisplay());
  }; /*,
    [setDisplaySettings, setOriginalImage]
  );*/
