import React, { useCallback, useEffect, useState } from "react";

import {
  IDisplay,
  IImageSettings,
  IOriginalImage,
  ITextSettings,
  ITextWithIconSettings,
} from "../../App";
import { getEmptyConvertedImage } from "../../definitions/emptyConvertedImage";
import { getBase64Image } from "../base64Encode";
import { composeImage } from "../composeImage";
import { fileToImage } from "../originalImage";
import { DisplaySettings } from "./DisplaySettings";
import { DropDisplay } from "./DropDisplay";

export const DisplaySettingsContainer = React.forwardRef<
  any,
  {
    originalImage: IOriginalImage;
    display: IDisplay;
    setOriginalImage: (buffer: Buffer) => void;
    setImageSettings: (settings: IImageSettings) => void;
    setTextSettings: (settings: ITextSettings) => void;
    setTextWithIconSettings: (settings: ITextWithIconSettings) => void;
  }
>(
  (
    {
      originalImage,
      display,
      setOriginalImage,
      setImageSettings,
      setTextSettings,
      setTextWithIconSettings,
    },
    menuRef
  ) => {
    const [previewImage, setPreviewImage] = useState<string>(
      getBase64Image(getEmptyConvertedImage())
    );
    useEffect(() => {
      (async () => {
        if (!originalImage)
          return setPreviewImage(getBase64Image(getEmptyConvertedImage()));
        const image = await composeImage(originalImage, 128, 64, display);
        setPreviewImage(getBase64Image(image));
      })();
    }, [originalImage, display]);

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const resizedBuffer = await fileToImage(acceptedFiles[0]);
        setOriginalImage(resizedBuffer);
      },
      [setOriginalImage]
    );
    return (
      <>
        <DropDisplay
          ref={menuRef}
          onDrop={onDrop}
          previewImage={previewImage}
        />
        <DisplaySettings
          textOnly={!originalImage}
          imageSettings={display.imageSettings}
          textSettings={display.textSettings}
          textWithIconSettings={display.textWithIconSettings}
          setImageSettings={setImageSettings}
          setTextSettings={setTextSettings}
          setTextWithIconSettings={setTextWithIconSettings}
        />
      </>
    );
  }
);
