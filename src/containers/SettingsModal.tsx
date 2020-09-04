import Jimp from "jimp/";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";

import { IDefaultBackDisplay } from "../App";
import { ContextMenu, ContextMenuItem } from "../lib/components/contextMenu";
import { DropDisplay } from "../lib/components/dropDisplay";
import { Modal } from "../lib/components/modal";
import { composeImage } from "../lib/convertFile";
import { loadDefaultBackDisplay } from "../lib/defaultBackImage";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Settings } from "./Settings";

export const SettingsModal: React.FC<{
  setClose: () => void;
  defaultBackDisplay: IDefaultBackDisplay;
  onClose: () => void;
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >;
}> = ({ setClose, defaultBackDisplay, setDefaultBackDisplay, onClose }) => {
  // store converted image for backbutton locally
  const [convertedPreviewImage, setConvertedPreviewImage] = useState<Buffer>(
    new Buffer(1024)
  );

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
  const previewImage = useMemo(() => {
    const b64img = getBase64Image(convertedPreviewImage);
    return b64img;
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
      <Settings
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
            settings: { ...defaultBackDisplay.settings, textWithIconSettings },
          })
        }
      />
    </Modal>
  );
};
