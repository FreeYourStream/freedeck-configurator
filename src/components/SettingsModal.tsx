import Jimp from "jimp/";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { IDefaultBackImage } from "../App";
import { composeImage } from "../lib/convertFile";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
import { DropDisplay } from "./lib/dropDisplay";
import { Modal } from "./lib/modal";

export const SettingsModal: React.FC<{
  setClose: () => void;
  defaultBackImage: IDefaultBackImage;
  setDefaultBackImage: (newDefault: IDefaultBackImage) => void;
}> = ({ setClose, defaultBackImage, setDefaultBackImage }) => {
  const [convertedPreviewImage, setConvertedPreviewImage] = useState<Buffer>(
    new Buffer(1024)
  );
  useEffect(() => {
    (async () => {
      const image = await composeImage(
        defaultBackImage.image,
        128,
        64,
        defaultBackImage.settings.imageSettings,
        defaultBackImage.settings.textWithIconSettings,
        defaultBackImage.settings.text
      );
      setConvertedPreviewImage(image);
    })();
  }, [
    defaultBackImage.image,
    defaultBackImage.settings.imageSettings,
    defaultBackImage.settings.text,
    defaultBackImage.settings.textWithIconSettings,
  ]);
  const previewImage = useMemo(() => {
    const b64img = getBase64Image(convertedPreviewImage);
    return b64img;
  }, [convertedPreviewImage]);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const buffer = await handleFileSelect(acceptedFiles[0]);
      const jimage = await Jimp.read(Buffer.from(buffer));
      const resizedBuffer = await jimage
        .scaleToFit(256, 128, "")
        .getBufferAsync("image/bmp");
      setDefaultBackImage({ ...defaultBackImage, image: resizedBuffer });
    },
    [defaultBackImage, setDefaultBackImage]
  );
  return (
    <Modal setClose={setClose}>
      <DropDisplay
        deleteImage={() => console.log("delete image")}
        onDrop={onDrop}
        previewImage={previewImage}
      />
    </Modal>
  );
};
