import {
  ArrowPathIcon,
  Bars3Icon,
  ChevronDoubleDownIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import c from "clsx";
import React, { useContext } from "react";
import { useDropzone } from "react-dropzone";

import { iconSize } from "../../../definitions/iconSizes";
import { ImagePreview } from "../../../lib/components/ImagePreview";
import { FDMenu, MenuEntry } from "../../../lib/components/Menu";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const DropDisplay = ({
  onDrop,
  pageId,
  displayIndex,
}: {
  onDrop: (acceptedFiles: File[]) => Promise<void> | void;
  displayIndex: number;
  pageId: string;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });
  const configState = useContext(ConfigStateContext);
  const display =
    pageId === "dbd"
      ? configState.defaultBackDisplay.display
      : configState.pages.byId[pageId].displayButtons[displayIndex].display;
  const configDispatch = useContext(ConfigDispatchContext);
  const entries: MenuEntry[] = [];
  if (pageId === "dbd") {
    entries.push({
      title: "Reset to default",
      onClick: () => configDispatch.resetDefaultBackButton(undefined),
      prefix: <ArrowPathIcon className={c(iconSize, "text-danger-400")} />,
    });
  } else {
    entries.push(
      {
        title: "Delete image",
        onClick: () =>
          configDispatch.deleteImage({
            buttonIndex: displayIndex,
            pageId: pageId,
          }),

        prefix: <TrashIcon className={c(iconSize, "text-danger-400")} />,
      },
      {
        title: "Make back button",
        onClick: () =>
          configDispatch.makeDefaultBackButton({
            buttonIndex: displayIndex,
            pageId: pageId,
          }),

        prefix: <ArrowPathIcon className={c(iconSize)} />,
      }
    );
  }

  return (
    <div className="relative flex w-full justify-center mb-4 bg-gradient-to-b bg-gray-800 rounded-2xl shadow-2xl">
      <div
        className="rounded-sm border-0"
        {...getRootProps({ style: { outline: "none" } })}
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="flex text-2xl font-extrabold h-32 items-center justify-center">
            <ChevronDoubleDownIcon className="h-12 w-12 m-4" />
            Drop Here
            <PhotoIcon className="h-12 w-12 m-4" />
          </div>
        )}
        {!isDragActive &&
          (display.originalImage || display.textSettings.text) && (
            <ImagePreview size={3} previewImage={display.previewImage} />
          )}
        {!isDragActive &&
          !display.originalImage &&
          !display.textSettings.text && (
            <div className="h-32 flex items-center justify-center bg-black w-64 cursor-pointer">
              Click me or Copy 'n paste
            </div>
          )}
      </div>
      <FDMenu className="absolute top-0 right-0" entries={entries}>
        <div className="rounded-full bg-gray-400 hover:bg-gray-300 p-2 m-2">
          <Bars3Icon className="h-6 w-6" />
        </div>
      </FDMenu>
    </div>
  );
};
