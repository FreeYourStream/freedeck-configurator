import bmp from "bmp-ts";
import Jimp from "jimp/";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import styled from "styled-components";

import { IDefaultBackDisplay } from "../App";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettings } from "../lib/components/DisplaySettings";
import { DropDisplay } from "../lib/components/DropDisplay";
import { Modal } from "../lib/components/Modal";
import { composeImage } from "../lib/convertFile";
import { loadDefaultBackDisplay } from "../lib/defaultBackImage";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";

export const GlobalSettings: React.FC<{
  setClose: () => void;
  defaultBackDisplay: IDefaultBackDisplay;
  onClose: () => void;
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >;
}> = ({ setClose, defaultBackDisplay, setDefaultBackDisplay, onClose }) => {
  // store converted image for backbutton locally
  const [
    convertedPreviewImage,
    setConvertedPreviewImage,
  ] = useState<Buffer | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // the localStorage stuff should NOT happen here
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

  //generate base64 string for live preview
  // const previewImage = useMemo(() => {
  //   const b64img = getBase64Image(convertedPreviewImage);
  //   new Jimp(convertedPreviewImage).getBase64()
  //   return b64img;
  // }, [convertedPreviewImage]);

  useEffect(() => {
    (async () => {
      if (!convertedPreviewImage) return;
      const bmpData = {
        data: convertedPreviewImage, // Buffer
        bitPP: 1,
        width: 128, // Number
        height: 64, // Number
      };
      const rawData = bmp.encode(bmpData);
      setPreviewImage(getBase64Image(convertedPreviewImage));
    })();
  }, [convertedPreviewImage]);
  //image loading
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const buffer = await handleFileSelect(acceptedFiles[0]);
      const jimage = await Jimp.read(Buffer.from(buffer));
      const resizedBuffer = await jimage
        .scaleToFit(256, 128, "")
        .getBufferAsync("image/png");
      localStorage.setItem("defaultBackImage", JSON.stringify(resizedBuffer));
      setDefaultBackDisplay({ ...defaultBackDisplay, image: resizedBuffer });
    },
    [defaultBackDisplay, setDefaultBackDisplay]
  );
  const menuId = `globalSettings`;
  const menuRef = useContextMenuTrigger<HTMLDivElement>({ menuId });
  return (
    <Modal
      setClose={() => {
        onClose();
        setClose();
      }}
      title="Default back button settings"
    >
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
      <div ref={menuRef}>
        <DropDisplay onDrop={onDrop} previewImage={previewImage} />
      </div>
      <DisplaySettings
        textOnly={false}
        imageSettings={defaultBackDisplay.settings.imageSettings}
        textSettings={defaultBackDisplay.settings.textSettings}
        textWithIconSettings={defaultBackDisplay.settings.textWithIconSettings}
        setImageSettings={(imageSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: { ...defaultBackDisplay.settings, imageSettings },
          })
        }
        setTextSettings={(textSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: { ...defaultBackDisplay.settings, textSettings },
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
    </Modal>
  );
};
