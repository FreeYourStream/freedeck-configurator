import { useCallback } from "react";

import {
  IConvertedImagePage,
  IDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";
import { composeImage, composeText } from "../../lib/image/composeImage";

export const useSetDisplaySettingsCallback = (
  displaySettingsPages: IDisplayPage[],
  originalImagePages: IOriginalImagePage[],
  convertedImagePages: IConvertedImagePage[],
  setDisplaySettingsPages: React.Dispatch<React.SetStateAction<IDisplayPage[]>>,
  setConvertedImagePages: React.Dispatch<
    React.SetStateAction<IConvertedImagePage[]>
  >
) =>
  useCallback(
    async (pageIndex: number, displayIndex: number, newDisplay: IDisplay) => {
      const newPages = [...displaySettingsPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setDisplaySettingsPages([...newPages]);
      const originalImage = originalImagePages[pageIndex][displayIndex];
      let convertedImage;
      if (originalImage !== null) {
        convertedImage = await composeImage(originalImage, 128, 64, newDisplay);
      } else if (newDisplay.textSettings.text !== null) {
        convertedImage = await composeText(128, 64, newDisplay);
      } else {
        return;
      }
      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[pageIndex][displayIndex] = convertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [
      convertedImagePages,
      displaySettingsPages,
      originalImagePages,
      setConvertedImagePages,
      setDisplaySettingsPages,
    ]
  );
