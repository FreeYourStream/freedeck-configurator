import Jimp from "jimp";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { IActionDisplay, IImageDisplay } from "../App";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
import useDebounce from "../lib/useDebounce";
import { Action } from "./Action";
import { Column, Row } from "./lib/misc";
import { Modal } from "./modal";
import { Settings } from "./Settings";

const Wrapper = styled.div<{ opacity: number }>`
  opacity: ${(p) => p.opacity};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  z-index: 10;
`;
const ImagePreview = styled.img<{ multiplier: number }>`
  width: ${(p) => p.multiplier * 128}px;
  height: ${(p) => p.multiplier * 64}px;
  image-rendering: pixelated;
  cursor: pointer;
`;
const DropWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 128px;
  background-color: #000000a1;
  border-radius: 16px;
`;
const DeleteImage = styled.img`
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  height: 22px;
  width: 22px;
  top: -8px;
  right: -8px;
  position: absolute;
  border-style: none;
  visibility: hidden;
  z-index: 10;
  ${DropWrapper}:hover & {
    visibility: visible;
  }
`;

const Drop = styled.div`
  border-radius: 8px;
  border-top: none;
  border-bottom: none;
`;

const DropHere = styled.div`
  font-size: 24px;
  color: white;
`;

const DisplayComponent: React.FC<{
  // rowBuffer: Buffer;
  image: { _revision: number; image: Buffer };
  addPage: () => number;
  setOriginalImage: (displayIndex: number, newImage: Buffer) => void;
  setDisplayAction: (displayIndex: number, display: IActionDisplay) => void;
  setDisplayImage: (displayIndex: number, display: IImageDisplay) => void;
  actionDisplay: IActionDisplay;
  imageDisplay: IImageDisplay;
  imageIndex: number;
  pages: number[];
  displayIndex: number;
  // switchDisplays: (aIndex: number, bIndex: number) => undefined;
}> = ({
  image,
  addPage,
  setOriginalImage: a,
  setDisplayAction: b,
  setDisplayImage: c,
  actionDisplay,
  imageDisplay,
  imageIndex,
  pages,
  displayIndex,
  // switchDisplays,
  // connectDragSource,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [localText, setLocalText] = useState<string>("");
  const debouncedText = useDebounce(localText, 300);

  const previewImage = useMemo(() => {
    const b64img = getBase64Image(image.image);
    return b64img;
  }, [image]);
  const [{ opacity }, dragRef] = useDrag({
    item: { type: "display", imageIndex },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });
  const [{ targetDisplayIndex }, drop] = useDrop({
    accept: "display",
    drop: (item, monitor): undefined =>
      // switchDisplays(targetDisplayIndex, monitor.getItem().imageIndex), undefined
      undefined,
    collect: () => ({ targetDisplayIndex: imageIndex }),
  });

  const setOriginalImage = useCallback(
    (newImage: Buffer) => {
      a(displayIndex, newImage);
    },
    [a, displayIndex]
  );
  const setDisplayAction = useCallback(
    (display: IActionDisplay) => {
      b(displayIndex, display);
    },
    [b, displayIndex]
  );
  const setDisplayImage = useCallback(
    (display: IImageDisplay) => {
      c(displayIndex, display);
    },
    [c, displayIndex]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const buffer = await handleFileSelect(acceptedFiles[0]);
      const jimage = await Jimp.read(Buffer.from(buffer));
      const resizedBuffer = await jimage
        .scaleToFit(256, 128, "")
        .getBufferAsync("image/bmp");
      setOriginalImage(resizedBuffer);
    },
    [setOriginalImage]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });

  const setSettings = useCallback(
    (imageSettings: IImageDisplay["imageSettings"]) => {
      setDisplayImage({ ...imageDisplay, imageSettings });
    },
    [imageDisplay, setDisplayImage]
  );

  const setText = useCallback(
    (text: IImageDisplay["text"]) => {
      setDisplayImage({ ...imageDisplay, text });
    },
    [imageDisplay, setDisplayImage]
  );

  useEffect(() => {
    setText(debouncedText);
    // dont put setText there, we will have an endless loop if you do
    // @ts-ignore
  }, [debouncedText]);

  const setTextSettings = useCallback(
    (textWithIconSettings: IImageDisplay["textWithIconSettings"]) => {
      setDisplayImage({
        ...imageDisplay,
        textWithIconSettings,
      });
    },
    [imageDisplay, setDisplayImage]
  );

  const setPrimaryAction = useCallback(
    (primary: IActionDisplay["primary"]) => {
      setDisplayAction({
        ...actionDisplay,
        primary,
      });
    },
    [actionDisplay, setDisplayAction]
  );

  const setSecondaryAction = useCallback(
    (secondary: IActionDisplay["secondary"]) => {
      setDisplayAction({
        ...actionDisplay,
        secondary,
      });
    },
    [actionDisplay, setDisplayAction]
  );
  return (
    <Wrapper ref={dragRef} opacity={opacity}>
      <ImagePreview
        ref={drop}
        multiplier={1}
        onClick={() => setShowSettings(true)}
        src={previewImage}
      />
      <Modal visible={showSettings} setClose={() => setShowSettings(false)}>
        <DropWrapper>
          <DeleteImage src="close.png" onClick={(...args) => undefined} />
          <Drop {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <DropHere>Drop Here</DropHere>
            ) : (
              <ImagePreview multiplier={2} src={previewImage} />
            )}
          </Drop>
        </DropWrapper>
        <Settings
          textOnly={image._revision === 0}
          show={showSettings}
          setSettings={setSettings}
          settings={imageDisplay.imageSettings}
          text={localText}
          setText={setLocalText}
          setTextSettings={setTextSettings}
          textSettings={imageDisplay.textWithIconSettings}
        />
        <Row>
          <Column>
            {actionDisplay && (
              <Action
                setActionSetting={setPrimaryAction}
                pages={pages}
                action={actionDisplay.primary}
                addPage={addPage}
                loadUserInteraction={false}
              />
            )}
          </Column>
          <Column>
            {actionDisplay.secondary.enabled && (
              <Action
                setActionSetting={setSecondaryAction}
                pages={pages}
                action={actionDisplay.secondary}
                addPage={addPage}
                loadUserInteraction={false}
              />
            )}
          </Column>
        </Row>
      </Modal>
    </Wrapper>
  );
};

export const Display = React.memo(DisplayComponent, (prev, next) => {
  if (prev.setDisplayAction !== next.setDisplayAction) return false;
  if (prev.setDisplayImage !== next.setDisplayImage) return false;
  if (prev.setOriginalImage !== next.setOriginalImage) return false;
  if (prev.actionDisplay._revision !== next.actionDisplay._revision)
    return false;
  if (prev.imageDisplay._revision === next.imageDisplay._revision) return false;
  if (prev.image._revision !== next.image._revision) return false;

  return true;
});
