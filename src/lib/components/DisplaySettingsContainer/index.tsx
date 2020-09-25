import React, { useCallback, useEffect, useState } from "react";

import {
  IDisplay,
  IImageSettings,
  IOriginalImage,
  ITextSettings,
  ITextWithIconSettings,
} from "../../../App";
import { getEmptyConvertedImage } from "../../../definitions/emptyConvertedImage";
import { fileToImage } from "../../fileToImage";
import { getBase64Image } from "../../image/base64Encode";
import { composeImage, composeText } from "../../image/composeImage";
import { DropDisplay } from "./DropDisplay";
import { ImageSettings } from "./ImageSettings";

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
        if (!originalImage) {
          if (!display.textWithIconSettings.enabled)
            setPreviewImage(getBase64Image(getEmptyConvertedImage()));
          else
            setPreviewImage(
              getBase64Image(await composeText(128, 64, display))
            );
        } else {
          setPreviewImage(
            getBase64Image(await composeImage(originalImage, 128, 64, display))
          );
        }
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
        <ImageSettings
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
