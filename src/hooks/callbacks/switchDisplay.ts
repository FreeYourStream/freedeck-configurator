import { useCallback } from "react";

import {
  IButtonPage,
  IConvertedImagePage,
  IDisplayPage,
  IOriginalImagePage,
} from "../../interfaces";

export const useSwitchDisplaysCallback = (
  buttonSettingsPages: IButtonPage[],
  convertedImagePages: IConvertedImagePage[],
  displaySettingsPages: IDisplayPage[],
  originalImagePages: IOriginalImagePage[],
  setButtonSettingsPages: React.Dispatch<React.SetStateAction<IButtonPage[]>>,
  setConvertedImagePages: React.Dispatch<
    React.SetStateAction<IConvertedImagePage[]>
  >,
  setDisplaySettingsPages: React.Dispatch<React.SetStateAction<IDisplayPage[]>>,
  setOriginalImagePages: React.Dispatch<
    React.SetStateAction<IOriginalImagePage[]>
  >
) =>
  useCallback(
    (
      aPageIndex: number,
      bPageIndex: number,
      aDisplayIndex: number,
      bDisplayIndex: number
    ) => {
      const aDisplayAction = {
        ...buttonSettingsPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayAction = {
        ...buttonSettingsPages[bPageIndex][bDisplayIndex],
      };
      const newActionPages = [...buttonSettingsPages];
      newActionPages[aPageIndex][aDisplayIndex] = bDisplayAction;
      newActionPages[bPageIndex][bDisplayIndex] = aDisplayAction;
      setButtonSettingsPages(newActionPages);

      const aDisplayImage = {
        ...displaySettingsPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayImage = {
        ...displaySettingsPages[bPageIndex][bDisplayIndex],
      };
      const newImagePages = [...displaySettingsPages];
      newImagePages[aPageIndex][aDisplayIndex] = bDisplayImage;
      newImagePages[bPageIndex][bDisplayIndex] = aDisplayImage;
      setDisplaySettingsPages(newImagePages);

      const aOriginalImage = originalImagePages[aPageIndex][aDisplayIndex];
      const bOriginalImage = originalImagePages[bPageIndex][bDisplayIndex];
      const newOriginalImages = [...originalImagePages];
      newOriginalImages[aPageIndex][aDisplayIndex] = bOriginalImage;
      newOriginalImages[bPageIndex][bDisplayIndex] = aOriginalImage;
      setOriginalImagePages(newOriginalImages);

      const aConvertedImage = convertedImagePages[aPageIndex][aDisplayIndex];
      const bConvertedImage = convertedImagePages[bPageIndex][bDisplayIndex];
      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[aPageIndex][aDisplayIndex] = bConvertedImage;
      newConvertedImages[bPageIndex][bDisplayIndex] = aConvertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [
      buttonSettingsPages,
      convertedImagePages,
      displaySettingsPages,
      originalImagePages,
      setButtonSettingsPages,
      setConvertedImagePages,
      setDisplaySettingsPages,
      setOriginalImagePages,
    ]
  );
