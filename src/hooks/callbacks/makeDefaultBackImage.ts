import { useCallback } from "react";

import { IDefaultBackDisplay, IDisplay, IOriginalImage } from "../../App";

export const useMakeDefaultBackImageCallback = (
  defaultBackDisplay: IDefaultBackDisplay,
  setDisplaySettings: (
    pageIndex: number,
    displayIndex: number,
    newDisplay: IDisplay
  ) => Promise<void>,
  setOriginalImage: (
    pageIndex: number,
    displayIndex: number,
    image: IOriginalImage
  ) => Promise<void>
) =>
  useCallback(
    async (pageIndex: number, displayIndex: number) => {
      await setDisplaySettings(
        pageIndex,
        displayIndex,
        defaultBackDisplay.settings
      );
      await setOriginalImage(pageIndex, displayIndex, defaultBackDisplay.image);
    },
    [
      defaultBackDisplay.image,
      defaultBackDisplay.settings,
      setDisplaySettings,
      setOriginalImage,
    ]
  );
