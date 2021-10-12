import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";
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
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.displaySettingsPages[pageIndex][displayIndex];
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
    <Wrapper
      tabIndex={0}
      contentEditable={false}
      ref={ref}
      onPaste={async (e) => {
        console.log("PASTE");
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
          previewImage={display.previewImage}
        />
      }
      <ImageSettings pageIndex={pageIndex} displayIndex={displayIndex} />
    </Wrapper>
  );
});
