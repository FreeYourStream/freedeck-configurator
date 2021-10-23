import {
  ChevronDoubleDownIcon,
  PhotographIcon,
  RefreshIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePreview } from "../../lib/components/ImagePreview";
import { Popover, PopoverEntry } from "../../lib/components/Popover";
import { ConfigDispatchContext } from "../../states/configState";

export const DropDisplay = ({
  onDrop,
  pageIndex,
  displayIndex,
}: {
  onDrop: (acceptedFiles: File[]) => Promise<void> | void;
  displayIndex: number;
  pageIndex: number;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  const configDispatch = useContext(ConfigDispatchContext);
  const [isOpen, setIsOpen] = useState(false);
  const entries: PopoverEntry[] = [];
  if (pageIndex === -1) {
    entries.push({
      title: "Reset to default",
      onClick: () => configDispatch.resetDefaultBackButton(undefined),
      prefix: <RefreshIcon className="h-6 w-6 text-danger-400" />,
    });
  } else {
    entries.push(
      {
        title: "Delete image",
        onClick: () =>
          configDispatch.deleteImage({
            buttonIndex: displayIndex,
            pageIndex: pageIndex,
          }),

        prefix: <TrashIcon className="h-6 w-6 text-danger-400" />,
      },
      {
        title: "Make back button",
        onClick: () =>
          configDispatch.makeDefaultBackButton({
            buttonIndex: displayIndex,
            pageIndex: pageIndex,
          }),

        prefix: <RefreshIcon className="h-6 w-6" />,
      }
    );
  }

  return (
    <div className="relative flex w-full justify-center mb-4 bg-gray-700 rounded-2xl shadow-2xl">
      <Popover isOpen={isOpen} setIsOpen={setIsOpen} entries={entries}>
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
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
            <ImagePreview
              big
              pageIndex={pageIndex}
              displayIndex={displayIndex}
            />
          )}
        </div>
      </Popover>
    </div>
  );
};
