import Jimp from "jimp";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { composeImage } from "../lib/convertFile";
import { handleFileSelect } from "../lib/fileSelect";
import { IRow, parseRow } from "../lib/parse/parsePage";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Action } from "./Action";
import { Settings } from "./Settings";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const ImagePreview = styled.img`
  width: 128px;
  height: 64px;
`
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

  ${Wrapper}:hover & {
    visibility: visible;
  }
`;

const DropWrapper = styled.div`
  position: relative;
`;

const Drop = styled.div`
  width: 128;
  height: 64px;
  border: 16px solid black;
  border-top: none;
  border-bottom: none;
`;

const DropHere = styled.div`
  font-size: 24px;
  color: white;
`;
const Border = styled.div`
  padding: 4px;
  border: 1px solid #555;
  border-top: none;
  height: 132px;
  width: 160px;
  border-radius: 0px 0px 2px 2px;
`
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
  const [convertedImageBuffer, setConvertedImageBuffer] = useState<Buffer>();
  const [croppedImage, setCroppedImage] = useState<Jimp>();
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
    if (row && convertedImageBuffer) {
      setImage(convertedImageBuffer);
    }
  }, [convertedImageBuffer]);

  useEffect(() => {
    
    if(newImageFile) {
      handleFileSelect(newImageFile).then(async arrayBuffer =>{
        const image = await Jimp.read(Buffer.from(arrayBuffer))
        image.scaleToFit(256,128)
        return setCroppedImage(image)
      });
    }
  }, [newImageFile])

  useEffect(() => {
    if (croppedImage && settings) {
      (async () => {
        const buffer = await composeImage(
          croppedImage,
          128,
          64,
          settings.contrast,
          settings.invert,
          settings.dither
        );
        setConvertedImageBuffer(buffer);
      })();
    }
  }, [croppedImage, settings]);

  const deleteImage = () => {
    setConvertedImageBuffer(new Buffer(1024));
    setNewImageFile(undefined);
    setPreviewImage(getBase64Image(images, imageIndex));
  };

  return (
    <Wrapper>
      <DropWrapper>
        <DeleteImage src="close.png" onClick={deleteImage} />
        <Drop {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <DropHere>Drop Here</DropHere>
          ) : (
            <ImagePreview src={previewImage} />
          )}
        </Drop>
      </DropWrapper>

      <Border>
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
      </Border>
    </Wrapper>
  );
};
