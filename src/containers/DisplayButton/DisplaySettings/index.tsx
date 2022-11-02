import React, { useContext, useEffect, useRef } from "react";

import { fileToImage } from "../../../lib/file/fileToImage";
import { ConfigDispatchContext } from "../../../states/configState";
import { DropDisplay } from "./DropDisplay";
import { ImageSettings } from "./ImageSettings";

export const DisplaySettingsContainer = ({
  pageId,
  displayIndex,
}: {
  pageId: string;
  displayIndex: number;
}) => {
  const configDispatch = useContext(ConfigDispatchContext);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.contentEditable = "true";
      ref.current.focus();
      ref.current.contentEditable = "false";
    }
  }, []);
  const onDrop = async (acceptedFiles: File[]) => {
    const resizedBuffer = await fileToImage(acceptedFiles[0]);
    configDispatch.setOriginalImage({
      pageId,
      buttonIndex: displayIndex,
      originalImage: resizedBuffer,
    });
  };
  return (
    <div
      className="w-full h-full flex flex-col justify-between focus:outline-none p-8"
      tabIndex={0}
      contentEditable={false}
      ref={ref}
      onPaste={async (e) => {
        configDispatch.setOriginalImage({
          buttonIndex: displayIndex,
          pageId,
          originalImage: await fileToImage(e.clipboardData.files[0]),
        });
      }}
    >
      {
        <DropDisplay
          onDrop={onDrop}
          pageId={pageId}
          displayIndex={displayIndex}
        />
      }
      <ImageSettings pageId={pageId} displayIndex={displayIndex} />
    </div>
  );
};
