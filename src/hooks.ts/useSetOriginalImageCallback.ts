import { useCallback } from "react";

import {
  IConvertedImage,
  IConvertedImagePage,
  IDisplayPage,
  IOriginalImagePage,
} from "../App";
import { composeImage } from "../lib/convertFile";

export const useSetOriginalImageCallback = function (
  convertedImagePages: IConvertedImagePage[],
  originalImagePages: IOriginalImagePage[],
  imageSettingPages: IDisplayPage[],
  setOriginalImagePages: (
    value: React.SetStateAction<IOriginalImagePage[]>
  ) => void,
  setConvertedImagePages: (
    value: React.SetStateAction<IConvertedImagePage[]>
  ) => void
) {
  return useCallback(
    async (pageIndex: number, displayIndex: number, image: Buffer | null) => {
      const display = imageSettingPages[pageIndex][displayIndex];
      let convertedImage: IConvertedImage;
      if (image !== null) {
        convertedImage = await composeImage(image, 128, 64, display);
      } else {
        convertedImage = new Buffer(1024);
      }
      const newOriginalImages = [...originalImagePages];
      newOriginalImages[pageIndex][displayIndex] = image;
      setOriginalImagePages(newOriginalImages);

      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[pageIndex][displayIndex] = convertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [
      convertedImagePages,
      originalImagePages,
      imageSettingPages,
      setOriginalImagePages,
      setConvertedImagePages,
    ]
  );
};
