import React, { useContext, useEffect, useRef } from "react";
import { fileToImage } from "../../lib/fileToImage";
import { ConfigDispatchContext } from "../../states/configState";
import { DropDisplay } from "./DropDisplay";
import { ImageSettings } from "./ImageSettings";

export const DisplaySettingsContainer = React.forwardRef<
  any,
  {
    pageIndex: number;
    displayIndex: number;
  }
>(({ pageIndex, displayIndex }, menuRef) => {
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
      pageIndex,
      buttonIndex: displayIndex,
      originalImage: resizedBuffer,
    });
  };
  return (
    <div
      className="w-full flex flex-col justify-between focus:outline-none"
      tabIndex={0}
      contentEditable={false}
      ref={ref}
      onPaste={async (e) => {
        configDispatch.setOriginalImage({
          buttonIndex: displayIndex,
          pageIndex,
          originalImage: await fileToImage(e.clipboardData.files[0]),
        });
      }}
    >
      {
        <DropDisplay
          ref={menuRef}
          onDrop={onDrop}
          pageIndex={pageIndex}
          displayIndex={displayIndex}
        />
      }
      <ImageSettings pageIndex={pageIndex} displayIndex={displayIndex} />
    </div>
  );
});
