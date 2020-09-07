import { useCallback } from "react";

import {
  IButton,
  IButtonPage,
  IConvertedImagePage,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";
import { EAction } from "../../lib/configFile/parsePage";

export const useDeletePageCallback = (
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
    (pageIndex: number) => {
      const newOriginalImages = [...originalImagePages];
      const newConvertedImages = [...convertedImagePages];
      newOriginalImages.splice(pageIndex, 1);
      newConvertedImages.splice(pageIndex, 1);
      setOriginalImagePages(newOriginalImages);
      setConvertedImagePages(newConvertedImages);

      let newActionPages = [...buttonSettingsPages];
      let newImagePages = [...displaySettingsPages];
      newActionPages.splice(pageIndex, 1);
      newImagePages.splice(pageIndex, 1);
      newActionPages = newActionPages.map<IButtonPage>((newPage) => {
        const displays = newPage.map<IButton>((display) => {
          if (display.primary.mode === EAction.changeLayout) {
            if (display.primary.values[0] >= pageIndex) {
              display.primary.values[0] -= 1;
            }
          }
          if (
            display.secondary.enabled &&
            display.secondary.mode === EAction.changeLayout
          ) {
            if (display.secondary.values[0] >= pageIndex) {
              display.secondary.values[0] -= 1;
            }
          }
          return { ...display };
        });
        return displays;
      });
      setButtonSettingsPages(newActionPages);
      setDisplaySettingsPages(newImagePages);
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
