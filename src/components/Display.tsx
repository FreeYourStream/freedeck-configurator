import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { parseRow, IRow, EAction } from "../lib/parse/parsePage";
import { getBase64Image } from "../lib/uint8ToBase64";
import { handleFileSelect } from "../lib/fileSelect";
import { composeImage } from "../lib/convertFile";
import { Settings } from "./Settings";
import { ROW_SIZE } from "../constants";
import { Keys, EKeys } from "../definitions/keys";
import { Action } from "./Action";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const DeleteImage = styled.button`
  background-color: white;
  border-radius: 50%;
  color: red;
  font-size: 15px;
  line-height: 15px;
  text-align: center;
  vertical-align: middle;
  height: 22px;
  width: 22px;
  top: -8px;
  left: -8px;
  box-shadow: 0px 0px 0px 1px #0000003d;
  font-weight: bold;
  font-family: sans-serif;
  position: absolute;
  border-style: none;
`;

const DropWrapper = styled.div`
  position: relative;
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
  setImage: (newImage: Buffer) => void;
  setRow: (newRow: number[]) => void;
  imageIndex: number;
  pages: number[];
}> = ({
  rowBuffer,
  images,
  setImage,
  setRow: setNewRow,
  imageIndex,
  pages
}) => {
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"]
  });

  useEffect(() => {
    const parsedRow = parseRow(rowBuffer);
    setRow(parsedRow);
  }, [rowBuffer]);

  useEffect(() => {
    if (row) {
      setPreviewImage(getBase64Image(images, imageIndex));
    }
  }, [row, images]);

  useEffect(() => {
    if (row && newImageBuffer) {
      setImage(newImageBuffer);
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

  const deleteImage = () => {
    setNewImageBuffer(new Buffer(1024));
    setNewImageFile(undefined);
    setPreviewImage(getBase64Image(images, imageIndex));
  };

  return (
    <Wrapper>
      <DropWrapper>
        <DeleteImage onClick={deleteImage}>x</DeleteImage>
        <Drop {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <DropHere>Drop Here</DropHere>
          ) : (
            <img src={previewImage} />
          )}
        </Drop>
      </DropWrapper>

      {newImageFile && <Settings setSettings={setSettings} />}
      {row && (
        <Action
          setNewRow={setNewRow}
          pages={pages}
          loadMode={row.action}
          loadKeys={row.keys}
          loadPage={row.page}
        />
      )}
    </Wrapper>
  );
};
