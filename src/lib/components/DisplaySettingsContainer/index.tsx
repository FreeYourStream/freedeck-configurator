import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { DispatchContext, StateContext } from "../../../state";
import { fileToImage } from "../../fileToImage";
import { DropDisplay } from "./DropDisplay";
import { ImageSettings } from "./ImageSettings";

const Wrapper = styled.div`
  :focus-visible {
    outline: none;
  }
`;

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
    dispatch.setOriginalImage({
      pageIndex,
      buttonIndex: displayIndex,
      originalImage: resizedBuffer,
    });
  };
  return (
    <Wrapper
      tabIndex={0}
      contentEditable={false}
      ref={ref}
      onPaste={async (e) => {
        console.log("PASTE");
        dispatch.setOriginalImage({
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
          previewImage={display.previewImage}
        />
      }
      <ImageSettings pageIndex={pageIndex} displayIndex={displayIndex} />
    </Wrapper>
  );
});
