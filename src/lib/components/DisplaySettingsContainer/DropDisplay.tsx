import {
  ChevronDoubleDownIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import React from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { ImagePreview } from "../ImagePreview";

const Drop = styled.div`
  border-radius: 8px;
  border-top: none;
  border-bottom: none;
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
    <div
      className="relative flex w-full justify-center mb-8 bg-gray-700 rounded-2xl shadow-2xl"
      ref={ref}
    >
      <Drop {...getRootProps({ style: { outline: "none" } })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex text-2xl font-extrabold h-32 items-center justify-center">
            <ChevronDoubleDownIcon className="h-12 w-12 m-4" />
            Drop Here
            <PhotographIcon className="h-12 w-12 m-4" />
          </div>
        ) : (
          <ImagePreview multiplier={2.5} src={previewImage} />
        )}
      </Drop>
    </div>
  );
});
