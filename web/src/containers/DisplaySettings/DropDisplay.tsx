import {
  ChevronDoubleDownIcon,
  MenuIcon,
  PhotographIcon,
  RefreshIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext } from "react";
import { useDropzone } from "react-dropzone";

import { iconSize } from "../../definitions/iconSizes";
import { ImagePreview } from "../../lib/components/ImagePreview";
import { FDMenu, MenuEntry } from "../../lib/components/Menu";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

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
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.pages[pageIndex][displayIndex].display;
  const configDispatch = useContext(ConfigDispatchContext);
  const entries: MenuEntry[] = [];
  if (pageIndex === -1) {
    entries.push({
      title: "Reset to default",
      onClick: () => configDispatch.resetDefaultBackButton(undefined),
      prefix: <RefreshIcon className={c(iconSize, "text-danger-400")} />,
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

        prefix: <TrashIcon className={c(iconSize, "text-danger-400")} />,
      },
      {
        title: "Make back button",
        onClick: () =>
          configDispatch.makeDefaultBackButton({
            buttonIndex: displayIndex,
            pageIndex: pageIndex,
          }),

        prefix: <RefreshIcon className={c(iconSize)} />,
      }
    );
  }

  return (
    <div className="relative flex w-full justify-center mb-4 bg-gray-700 rounded-2xl shadow-2xl">
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
          <ImagePreview size={3} previewImage={display.previewImage} />
        )}
      </div>
      <FDMenu className="absolute top-0 right-0" entries={entries}>
        <div className="rounded-full bg-gray-400 hover:bg-gray-300 p-2">
          <MenuIcon className="h-6 w-6"></MenuIcon>
        </div>
      </FDMenu>
    </div>
  );
};
