import Jimp from "jimp/";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";

import { IDefaultBackImage } from "../App";
import { ContextMenu, ContextMenuItem } from "../components/contextMenu";
import { DropDisplay } from "../components/dropDisplay";
import { Modal } from "../components/modal";
import { composeImage } from "../lib/convertFile";
import { loadDefaultBackImage } from "../lib/defaultBackImage";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Settings } from "./Settings";

export const SettingsModal: React.FC<{
  setClose: () => void;
  defaultBackImage: IDefaultBackImage;
  onClose: () => void;
  setDefaultBackImage: React.Dispatch<React.SetStateAction<IDefaultBackImage>>;
}> = ({ setClose, defaultBackImage, setDefaultBackImage, onClose }) => {
  // store converted image for backbutton locally
  const [convertedPreviewImage, setConvertedPreviewImage] = useState<Buffer>(
    new Buffer(1024)
  );

  // the localStorage stuff should NOT happen here
  useEffect(() => {
    (async () => {
      const image = await composeImage(
        defaultBackImage.image,
        128,
        64,
        defaultBackImage.settings
      );
      setTimeout(() =>
        localStorage.setItem(
          "defaultBackImageSettings",
          JSON.stringify(defaultBackImage.settings)
        )
      );
      setTimeout(() =>
        localStorage.setItem(
          "defaultBackImage",
          JSON.stringify(defaultBackImage.image)
        )
      );
      setConvertedPreviewImage(image);
    })();
  }, [defaultBackImage.image, defaultBackImage.settings]);

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
      setDefaultBackImage({ ...defaultBackImage, image: resizedBuffer });
    },
    [defaultBackImage, setDefaultBackImage]
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
          onClick={() =>
            loadDefaultBackImage(defaultBackImage, setDefaultBackImage)
          }
          dangerous
        ></ContextMenuItem>
      </ContextMenu>
      <div ref={menuRef}>
        <DropDisplay onDrop={onDrop} previewImage={previewImage} />
      </div>
      <Settings
        textOnly={false}
        imageSettings={defaultBackImage.settings.imageSettings}
        textSettings={defaultBackImage.settings.textSettings}
        textWithIconSettings={defaultBackImage.settings.textWithIconSettings}
        setImageSettings={(imageSettings) =>
          setDefaultBackImage({
            ...defaultBackImage,
            settings: { ...defaultBackImage.settings, imageSettings },
          })
        }
        setTextSettings={(textSettings) =>
          setDefaultBackImage({
            ...defaultBackImage,
            settings: { ...defaultBackImage.settings, textSettings },
          })
        }
        setTextWithIconSettings={(textWithIconSettings) =>
          setDefaultBackImage({
            ...defaultBackImage,
            settings: { ...defaultBackImage.settings, textWithIconSettings },
          })
        }
      />
    </Modal>
  );
};
