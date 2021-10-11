import React from "react";
import { useDropzone } from "react-dropzone";
import styled, { StyledComponent } from "styled-components";
import { colors } from "../../../definitions/colors";
import { ImagePreview } from "../ImagePreview";

export const DropWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: center;
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

export const DropDisplay = React.forwardRef<
  any,
  {
    onDrop: (acceptedFiles: File[]) => Promise<void> | void;
    previewImage: string;
  }
>(({ onDrop, previewImage }, ref) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  return (
    <DropWrapper ref={ref}>
      <Drop {...getRootProps({ style: { outline: "none" } })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <DropHere>Drop Here</DropHere>
        ) : (
          <ImagePreview multiplier={2.5} src={previewImage} />
        )}
      </Drop>
    </DropWrapper>
  );
});
