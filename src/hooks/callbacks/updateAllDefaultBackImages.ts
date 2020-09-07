import { useCallback } from "react";

import { IDefaultBackDisplay, IDisplay, IDisplayPage } from "../../App";

export const useUpdateAllDefaultBackImagesCallback = (
  displaySettingsPages: IDisplayPage[],
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >,
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
  (newDefaultBackImage: IDefaultBackDisplay) => {
    setDefaultBackDisplay(newDefaultBackImage);
    [...displaySettingsPages].forEach((page, pageIndex) => {
      [...page].forEach((display, displayIndex) => {
        if (display.isGeneratedFromDefaultBackImage) {
          setDisplaySettings(
            pageIndex,
            displayIndex,
            newDefaultBackImage.settings
          );
          setOriginalImage(pageIndex, displayIndex, newDefaultBackImage.image);
        }
      });
    });
  }; /*,
    [
      displaySettingsPages,
      setDefaultBackDisplay,
      setDisplaySettings,
      setOriginalImage,
    ]
  );
*/
