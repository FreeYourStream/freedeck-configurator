import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { parseRow, IRow } from "../lib/parse/parsePage";
import { getBase64Image } from "../lib/uint8ToBase64";
import { handleFileSelect } from "../lib/fileSelect";
import { composeImage } from "../lib/convertFile";
import { Settings } from "./Settings";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  flex-direction: column;
`;

const Drop = styled.div`
  width: 128px;
  height: 64px;
`;

const DropHere = styled.div`
  font-size: 24px;
  color: white;
`;

export const Display: React.FC<{
  rowBuffer: Buffer;
  images: Buffer[];
  setImages: (newImages: Buffer[]) => void;
}> = ({ rowBuffer, images, setImages }) => {
  const [row, setRow] = useState<IRow>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File>();
  const [newImageBuffer, setNewImageBuffer] = useState<Buffer>();
  const [settings, setSettings] = useState<{
    contrast: number;
    dither: boolean;
    invert: boolean;
  }>();

  const onDrop = useCallback(acceptedFiles => {
    setNewImageFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const parsedRow = parseRow(rowBuffer);
    setRow(parsedRow);
  }, [rowBuffer]);

  useEffect(() => {
    if (row) {
      setPreviewImage(getBase64Image(images, row.imageIndex));
    }
  }, [row, images]);

  useEffect(() => {
    if (row && newImageBuffer) {
      const newImages = [...images];
      newImages[row.imageIndex] = newImageBuffer;
      setImages(newImages);
    }
  }, [newImageBuffer]);

  useEffect(() => {
    if (newImageFile && settings) {
      (async () => {
        const arrayBuffer = await handleFileSelect(newImageFile);
        const buffer = await composeImage(
          arrayBuffer,
          128,
          64,
          settings.contrast,
          settings.invert,
          settings.dither
        );
        setNewImageBuffer(buffer);
      })();
    }
  }, [newImageFile, settings]);

  return (
    <Wrapper>
      <Drop {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <DropHere>Drop Here</DropHere>
        ) : (
          <img src={previewImage} />
        )}
      </Drop>
      {newImageFile && <Settings setSettings={setSettings} />}
    </Wrapper>
  );
};
