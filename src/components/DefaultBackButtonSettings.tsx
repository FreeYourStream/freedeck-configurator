import Jimp from "jimp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";

import { IDefaultBackDisplay } from "../App";
import { getEmptyConvertedImage } from "../definitions/emptyConvertedImage";
import { getBase64Image } from "../lib/base64Encode";
import { FDButton } from "../lib/components/Button";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettings } from "../lib/components/DisplaySettings";
import { DropDisplay } from "../lib/components/DropDisplay";
import { composeImage } from "../lib/composeImage";
import { loadDefaultBackDisplay } from "../lib/defaultBackImage";
import { handleFileSelect } from "../lib/handleFileSelect";
import { fileToImage } from "../lib/originalImage";

export const DefaultBackButtonSettings: React.FC<{
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >;
  defaultBackDisplay: IDefaultBackDisplay;
}> = ({ setDefaultBackDisplay, defaultBackDisplay }) => {
  const menuId = `defaultBackButtonSettings`;
  const menuRef = useContextMenuTrigger<HTMLDivElement>({ menuId }); //image loading

  // store converted image for backbutton locally
  const [convertedPreviewImage, setConvertedPreviewImage] = useState<Buffer>(
    getEmptyConvertedImage()
  );
  const [previewImage, setPreviewImage] = useState<string>("");
  // the localStorage stuff should NOT happen here?
  useEffect(() => {
    (async () => {
      const image = await composeImage(
        defaultBackDisplay.image,
        128,
        64,
        defaultBackDisplay.settings
      );
      setTimeout(() =>
        localStorage.setItem(
          "defaultBackImageSettings",
          JSON.stringify(defaultBackDisplay.settings)
        )
      );
      setTimeout(() =>
        localStorage.setItem(
          "defaultBackImage",
          JSON.stringify(defaultBackDisplay.image)
        )
      );
      setConvertedPreviewImage(image);
    })();
  }, [defaultBackDisplay.image, defaultBackDisplay.settings]);

  useEffect(() => {
    (async () => {
      if (!convertedPreviewImage) return;
      setPreviewImage(getBase64Image(convertedPreviewImage));
    })();
  }, [convertedPreviewImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const resizedBuffer = await fileToImage(acceptedFiles[0]);
      setDefaultBackDisplay({ ...defaultBackDisplay, image: resizedBuffer });
    },
    [defaultBackDisplay, setDefaultBackDisplay]
  );

  return (
    <>
      <ContextMenu menuId={menuId}>
        <ContextMenuItem
          text="Reset to default"
          icon="bi/BiReset"
          onClick={() => {
            loadDefaultBackDisplay(setDefaultBackDisplay, true);
          }}
          dangerous
        ></ContextMenuItem>
      </ContextMenu>
      <DropDisplay ref={menuRef} onDrop={onDrop} previewImage={previewImage} />
      <DisplaySettings
        textOnly={false}
        imageSettings={defaultBackDisplay.settings.imageSettings}
        textSettings={defaultBackDisplay.settings.textSettings}
        textWithIconSettings={defaultBackDisplay.settings.textWithIconSettings}
        setImageSettings={(imageSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              imageSettings,
            },
          })
        }
        setTextSettings={(textSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              textSettings,
            },
          })
        }
        setTextWithIconSettings={(textWithIconSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              textWithIconSettings,
            },
          })
        }
      />
    </>
  );
};
