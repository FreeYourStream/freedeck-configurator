import React, { useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDropzone } from "react-dropzone";
import { BiReset } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import styled, { StyledComponent } from "styled-components";

import { colors } from "../../definitions/colors";
import { ImagePreview } from "./bwImagePreview";
import { ContextMenu, ContextMenuItem } from "./contextMenu";

export const DropWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 128px;
  background-color: #000000a1;
  border-radius: 16px;
  margin-bottom: 8px;
`;
export const CornerIcon = styled.div<{ parent: StyledComponent<any, any> }>`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${colors.white};
  border-radius: 50%;
  border: 1px solid ${colors.black};
  height: 28px;
  width: 28px;
  top: -8px;
  right: -8px;
  position: absolute;
  visibility: hidden;
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
  onDrop: (acceptedFiles: File[]) => Promise<void> | void;
  previewImage: string;
}> = ({ onDrop, previewImage }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  return (
    <DropWrapper>
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
