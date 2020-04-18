import Jimp from "jimp";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { composeImage, composeText } from "../lib/convertFile";
import { handleFileSelect } from "../lib/fileSelect";
import { IRow, parseRow } from "../lib/parse/parsePage";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Action } from "./Action";
import { Settings } from "./Settings";
import { Modal } from "./modal";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  z-index: 10;
`;
const ImagePreview = styled.img<{ multiplier: number }>`
  width: ${(p) => p.multiplier * 128}px;
  height: ${(p) => p.multiplier * 64}px;
  image-rendering: pixelated;
`;
const DropWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 128px;
  background-color: #000000a1;
  border-radius: 16px;
`;
const DeleteImage = styled.img`
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  height: 22px;
  width: 22px;
  top: -8px;
  right: -8px;
  position: absolute;
  border-style: none;
  visibility: hidden;
  z-index: 10;
  ${DropWrapper}:hover & {
    visibility: visible;
  }
`;

const Drop = styled.div`
  border-radius: 8px;
  border-top: none;
  border-bottom: none;
`;

const DropHere = styled.div`
  font-size: 24px;
  color: white;
`;

const DisplayComponent: React.FC<{
  rowBuffer: Buffer;
  images: Buffer[];
  addPage: () => number;
  setImage: (newImage: Buffer) => void;
  setRow: (newRow: Buffer) => void;
  imageIndex: number;
  pages: number[];
}> = ({
  rowBuffer,
  images,
  addPage,
  setImage,
  setRow: setNewRow,
  imageIndex,
  pages,
}) => {
  const [row, setRow] = useState<IRow>();
  const [secondary, setSecondary] = useState<IRow>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File>();
  const [convertedImageBuffer, setConvertedImageBuffer] = useState<Buffer>();
  const [croppedImage, setCroppedImage] = useState<Jimp>();
  const [settings, setSettings] = useState<{
    contrast: number;
    dither: boolean;
    invert: boolean;
    text: string;
    textEnabled: boolean;
    fontName: string;
  }>();
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles) => {
    setNewImageFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });

  useEffect(() => {
    const parsedRow = parseRow(rowBuffer);
    const parsedSecondary = parseRow(rowBuffer, 8);
    setRow(parsedRow);
    setSecondary(parsedSecondary);
  }, [rowBuffer]);

  useEffect(() => {
    if (row) {
      setPreviewImage(getBase64Image(images, imageIndex));
    }
  }, [row, images]);

  useEffect(() => {
    if (row && convertedImageBuffer) {
      setPreviewImage(getBase64Image([convertedImageBuffer], 0));
      setImage(convertedImageBuffer);
    }
  }, [convertedImageBuffer]);

  useEffect(() => {
    if (newImageFile) {
      handleFileSelect(newImageFile).then(async (arrayBuffer) => {
        const image = await Jimp.read(Buffer.from(arrayBuffer));
        image.scaleToFit(256, 128);
        setShowSettings(true);
        return setCroppedImage(image);
      });
    }
  }, [newImageFile]);

  useEffect(() => {
    if (croppedImage && settings) {
      (async () => {
        const buffer = await composeImage(
          croppedImage,
          128,
          64,
          settings.contrast,
          settings.invert,
          settings.dither,
          settings.textEnabled,
          settings.text,
          settings.fontName
        );
        setConvertedImageBuffer(buffer);
      })();
    } else if (settings && settings.text.length) {
      (async () => {
        const buffer = await composeText(
          128,
          64,
          settings.dither,
          settings.text,
          settings.fontName,
          settings.contrast
        );
        setConvertedImageBuffer(buffer);
      })();
    }
  }, [croppedImage, settings]);

  const deleteImage = () => {
    setConvertedImageBuffer(new Buffer(1024));
    setNewImageFile(undefined);
    setCroppedImage(undefined);
    setPreviewImage(getBase64Image(images, imageIndex));
  };

  const isBlack = useMemo(() => !images[imageIndex]?.find((val) => val !== 0), [
    images,
  ]);
  const allowSettings = useMemo(
    () => isBlack || !!newImageFile || !!settings?.text.length,
    [isBlack, newImageFile, settings?.text]
  );

  return (
    <Wrapper>
      <ImagePreview
        multiplier={1}
        onClick={() => setShowSettings(true)}
        src={previewImage}
      />
      <Modal visible={showSettings} setClose={() => setShowSettings(false)}>
        <DropWrapper>
          <DeleteImage src="close.png" onClick={deleteImage} />
          <Drop {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <DropHere>Drop Here</DropHere>
            ) : (
              <ImagePreview multiplier={2} src={previewImage} />
            )}
          </Drop>
        </DropWrapper>
        <Settings
          textOnly={!newImageFile}
          show={showSettings}
          setSettings={setSettings}
        />
        {row && secondary && (
          <Action
            setNewRow={setNewRow}
            pages={pages}
            loadMode={row.action}
            loadKeys={row.keys}
            loadPage={row.page}
            loadModeSecondary={secondary.action}
            loadKeysSecondary={secondary.keys}
            loadPageSecondary={secondary.page}
            addPage={addPage}
          />
        )}
      </Modal>
    </Wrapper>
  );
};

export const Display = React.memo(DisplayComponent, (prev, next) => {
  if (Buffer.compare(prev.rowBuffer, next.rowBuffer) !== 0) return false;
  return true;
});
