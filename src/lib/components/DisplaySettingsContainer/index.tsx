import React, { useContext } from "react";
import { DispatchContext, StateContext } from "../../../state";
import { fileToImage } from "../../fileToImage";
import { DropDisplay } from "./DropDisplay";
import { ImageSettings } from "./ImageSettings";

export const DisplaySettingsContainer = React.forwardRef<
  any,
  {
    pageIndex: number;
    displayIndex: number;
  }
>(({ pageIndex, displayIndex }, menuRef) => {
  const state = useContext(StateContext);
  const display =
    pageIndex === -1
      ? state.defaultBackDisplay
      : state.displaySettingsPages[pageIndex][displayIndex];
  const dispatch = useContext(DispatchContext);
  const onDrop = async (acceptedFiles: File[]) => {
    const resizedBuffer = await fileToImage(acceptedFiles[0]);
    dispatch.setOriginalImage({
      pageIndex,
      buttonIndex: displayIndex,
      originalImage: resizedBuffer,
    });
  };
  return (
    <>
      {
        <DropDisplay
          ref={menuRef}
          onDrop={onDrop}
          previewImage={display.previewImage}
        />
      }
      <ImageSettings pageIndex={pageIndex} displayIndex={displayIndex} />
    </>
  );
});
