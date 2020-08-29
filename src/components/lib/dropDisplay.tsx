import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrashAlt } from "react-icons/fa";
import styled, { StyledComponent } from "styled-components";

import { getBase64Image } from "../../lib/uint8ToBase64";
import { ImagePreview } from "./bwImagePreview";

export const DropWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 128px;
  background-color: #000000a1;
  border-radius: 16px;
`;
export const DeleteImage = styled.div<{ parent: StyledComponent<any, any> }>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: red;
  border-radius: 50%;
  height: 28px;
  width: 28px;
  top: -8px;
  right: -8px;
  position: absolute;
  border-style: none;
  visibility: hidden;
  z-index: 10;
  ${(p) => p.parent}:hover & {
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

export const DropDisplay: React.FC<{
  deleteImage: () => void;
  onDrop: (acceptedFiles: File[]) => Promise<void> | void;
  previewImage: string;
}> = ({ deleteImage, onDrop, previewImage }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  return (
    <DropWrapper>
      <DeleteImage parent={DropWrapper} onClick={deleteImage}>
        <FaTrashAlt size={18} color="white" />
      </DeleteImage>
      <Drop {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <DropHere>Drop Here</DropHere>
        ) : (
          <ImagePreview multiplier={2} src={previewImage} />
        )}
      </Drop>
    </DropWrapper>
  );
};
