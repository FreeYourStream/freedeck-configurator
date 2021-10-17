import {
  ChevronDoubleDownIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import React from "react";
import { useDropzone } from "react-dropzone";
import { ImagePreview } from "../../lib/components/ImagePreview";

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
      className="relative flex w-full justify-center mb-4 bg-gray-700 rounded-2xl shadow-2xl"
      ref={ref}
    >
      <div
        className="rounded-sm border-0"
        {...getRootProps({ style: { outline: "none" } })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex text-2xl font-extrabold h-32 items-center justify-center">
            <ChevronDoubleDownIcon className="h-12 w-12 m-4" />
            Drop Here
            <PhotographIcon className="h-12 w-12 m-4" />
          </div>
        ) : (
          <ImagePreview big src={previewImage} />
        )}
      </div>
    </div>
  );
});
