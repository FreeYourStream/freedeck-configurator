import { useCallback } from "react";

import {
  IButtonSettings,
  IButtonSettingsPage,
  IConvertedImagePage,
  IDisplaySettingsPage,
  IOriginalImagePage,
} from "../../interfaces";
import { EAction } from "../../definitions/modes";

export const useDeletePageCallback = (
  buttonSettingsPages: IButtonSettingsPage[],
  convertedImagePages: IConvertedImagePage[],
  displaySettingsPages: IDisplaySettingsPage[],
  originalImagePages: IOriginalImagePage[],
  setButtonSettingsPages: React.Dispatch<
    React.SetStateAction<IButtonSettingsPage[]>
  >,
  setConvertedImagePages: React.Dispatch<
    React.SetStateAction<IConvertedImagePage[]>
  >,
  setDisplaySettingsPages: React.Dispatch<
    React.SetStateAction<IDisplaySettingsPage[]>
  >,
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
      newActionPages = newActionPages.map<IButtonSettingsPage>((newPage) => {
        const displays = newPage.map<IButtonSettings>((display) => {
          if (display.primary.mode === EAction.changePage) {
            if (display.primary.values[0] >= pageIndex) {
              display.primary.values[0] -= 1;
            }
          }
          if (
            display.secondary.enabled &&
            display.secondary.mode === EAction.changePage
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
