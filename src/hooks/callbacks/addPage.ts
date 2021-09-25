import { useCallback } from "react";

import {
  IButtonSettingsPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplaySettingsPage,
  IOriginalImagePage,
} from "../../interfaces";
import {
  createDefaultButtonSettingsPage,
  createDefaultDisplaySettingsPage,
} from "../../definitions/defaultPage";
import { getEmptyConvertedImage } from "../../definitions/emptyConvertedImage";
import { composeImage } from "../../lib/image/composeImage";

export const useAddPageCallback = (
  width: number,
  height: number,
  setOriginalImagePages: React.Dispatch<
    React.SetStateAction<IOriginalImagePage[]>
  >,
  originalImagePages: IOriginalImagePage[],
  setConvertedImagePages: React.Dispatch<
    React.SetStateAction<IConvertedImagePage[]>
  >,
  convertedImagePages: IConvertedImagePage[],
  buttonSettingsPages: IButtonSettingsPage[],
  setButtonSettingsPages: React.Dispatch<
    React.SetStateAction<IButtonSettingsPage[]>
  >,
  setDisplaySettingsPages: React.Dispatch<
    React.SetStateAction<IDisplaySettingsPage[]>
  >,
  displaySettingsPages: IDisplaySettingsPage[],
  defaultBackDisplay: IDefaultBackDisplay
) =>
  useCallback(
    async (
      previousPageIndex?: number,
      previousDisplayIndex?: number,
      primary?: boolean
    ) => {
      const newOriginalImagePage = [];
      const newConvertedImagePage = [];
      let newDisplayPage = createDefaultDisplaySettingsPage(width, height);
      for (let i = 0; i < width * height; i++) {
        if (previousPageIndex !== undefined && i === 0) {
          newOriginalImagePage.push(Buffer.from(defaultBackDisplay.image));
          newDisplayPage[i] = {
            ...defaultBackDisplay.settings,
            isGeneratedFromDefaultBackImage: true,
          };
          newConvertedImagePage.push(
            await composeImage(
              defaultBackDisplay.image,
              128,
              64,
              defaultBackDisplay.settings
            )
          );
        } else {
          newOriginalImagePage.push(null);
          newConvertedImagePage.push(getEmptyConvertedImage());
        }
      }

      setOriginalImagePages([...originalImagePages, newOriginalImagePage]);
      setConvertedImagePages([...convertedImagePages, newConvertedImagePage]);

      const newActionSettingPages = [
        ...buttonSettingsPages,
        createDefaultButtonSettingsPage(width, height, previousPageIndex),
      ];
      if (
        previousDisplayIndex !== undefined &&
        previousPageIndex !== undefined &&
        primary !== undefined
      ) {
        newActionSettingPages[previousPageIndex][previousDisplayIndex][
          primary ? "primary" : "secondary"
        ].values = [buttonSettingsPages.length];
      }
      setButtonSettingsPages(newActionSettingPages);
      setDisplaySettingsPages([...displaySettingsPages, newDisplayPage]);
      return buttonSettingsPages.length;
    },
    [
      width,
      height,
      setOriginalImagePages,
      originalImagePages,
      setConvertedImagePages,
      convertedImagePages,
      buttonSettingsPages,
      setButtonSettingsPages,
      setDisplaySettingsPages,
      displaySettingsPages,
      defaultBackDisplay.image,
      defaultBackDisplay.settings,
    ]
  );
