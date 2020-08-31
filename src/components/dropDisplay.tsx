import React from "react";
import { useDropzone } from "react-dropzone";
import { BiReset } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import styled, { StyledComponent } from "styled-components";

import { ImagePreview } from "./bwImagePreview";

export const DropWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 128px;
  background-color: #000000a1;
  border-radius: 16px;
  margin-bottom: 8px;
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
  resetImage?: boolean;
  previewImage: string;
}> = ({ deleteImage, onDrop, previewImage, resetImage }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  return (
    <DropWrapper>
      <DeleteImage parent={DropWrapper} onClick={deleteImage}>
        {resetImage ? (
          <BiReset size={18} color="white" />
        ) : (
          <FaTrashAlt size={18} color="white" />
        )}
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
