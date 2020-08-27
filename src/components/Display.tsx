import Jimp from "jimp";
import React, { useCallback, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { IActionDisplay, IImageDisplay } from "../App";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
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
  image: Buffer;
  addPage: () => number;
  deleteImage: () => void;
  setOriginalImage: (newImage: Buffer) => void;
  setDisplayAction: (display: IActionDisplay) => void;
  setDisplayImage: (display: IImageDisplay) => void;
  hasOriginalImage: boolean;
  actionDisplay: IActionDisplay;
  imageDisplay: IImageDisplay;
  pageIndex: number;
  pages: number[];
  displayIndex: number;
  switchDisplays: (
    aPageIndex: number,
    bPageIndex: number,
    aDisplayIndex: number,
    bDisplayIndex: number
  ) => void;
}> = ({
  hasOriginalImage,
  image,
  addPage,
  deleteImage,
  setOriginalImage,
  setDisplayAction,
  setDisplayImage,
  actionDisplay,
  imageDisplay,
  pageIndex,
  pages,
  displayIndex,
  switchDisplays,
  // connectDragSource,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const previewImage = useMemo(() => {
    const b64img = getBase64Image(image);
    return b64img;
  }, [image]);
  const [{ opacity }, dragRef] = useDrag({
    item: { type: "display", pageIndex, displayIndex },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });
  const [{ targetDisplayIndex, targetPageIndex }, drop] = useDrop({
    accept: "display",
    drop: (item, monitor): void =>
      switchDisplays(
        targetPageIndex,
        monitor.getItem().pageIndex,
        targetDisplayIndex,
        monitor.getItem().displayIndex
      ),
    collect: () => ({
      targetDisplayIndex: displayIndex,
      targetPageIndex: pageIndex,
    }),
  });

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

  return (
    <Wrapper ref={dragRef} opacity={opacity}>
      <ImagePreview
        ref={drop}
        multiplier={1}
        onClick={() => setShowSettings(true)}
        src={previewImage}
      />
      {showSettings && (
        <Modal visible={showSettings} setClose={() => setShowSettings(false)}>
          <DropWrapper>
            <DeleteImage src="close.png" onClick={deleteImage} />
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
            textOnly={!hasOriginalImage}
            show={showSettings}
            setSettings={(imageSettings) =>
              setDisplayImage({ ...imageDisplay, imageSettings })
            }
            settings={imageDisplay.imageSettings}
            text={imageDisplay.text}
            setText={(text) => setDisplayImage({ ...imageDisplay, text })}
            setTextSettings={(textWithIconSettings) =>
              setDisplayImage({ ...imageDisplay, textWithIconSettings })
            }
            textSettings={imageDisplay.textWithIconSettings}
          />
          <Row>
            <Column>
              {actionDisplay && (
                <Action
                  setActionSetting={(primary) =>
                    setDisplayAction({ ...actionDisplay, primary })
                  }
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
                  setActionSetting={(secondary) =>
                    setDisplayAction({ ...actionDisplay, secondary })
                  }
                  pages={pages}
                  action={actionDisplay.secondary}
                  addPage={addPage}
                  loadUserInteraction={false}
                />
              )}
            </Column>
          </Row>
        </Modal>
      )}
    </Wrapper>
  );
};

export const Display = React.memo(DisplayComponent, (prev, next) => {
  return false;
  // if (prev.setDisplayAction !== next.setDisplayAction) return false;
  // if (prev.setDisplayImage !== next.setDisplayImage) return false;
  // if (prev.setOriginalImage !== next.setOriginalImage) return false;
  // if (prev.actionDisplay._revision !== next.actionDisplay._revision)
  //   return false;
  // if (prev.imageDisplay._revision === next.imageDisplay._revision) return false;
  // if (prev.image._revision !== next.image._revision) return false;

  // return true;
});
