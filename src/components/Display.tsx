import Jimp from "jimp";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import { IDisplay } from "../App";
import { composeImage, composeText } from "../lib/convertFile";
import { handleFileSelect } from "../lib/fileSelect";
import { EAction, IRow, parseRow } from "../lib/parse/parsePage";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Action } from "./Action";
import { Column, Row } from "./lib/misc";
import { Modal } from "./modal";
import { ISettings, Settings, fontLarge } from "./Settings";

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

export const Display: React.FC<{
  // rowBuffer: Buffer;
  // images: Buffer[];
  addPage: () => number;
  // setImage: (newImage: Buffer) => void;
  // setRow: (newRow: Buffer, offset: number) => void;
  display: IDisplay
  imageIndex: number;
  pages: number[];
  // switchDisplays: (aIndex: number, bIndex: number) => undefined;
}> = ({
  // rowBuffer,
  // images,
  addPage,
  // setImage,
  // setRow: setNewRow,
  display,
  imageIndex,
  pages,
  // switchDisplays,
  // connectDragSource,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [{ opacity }, dragRef] = useDrag({
    item: { type: "display", imageIndex },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });
  const [{ targetDisplayIndex }, drop] = useDrop({
    accept: "display",
    drop: (item, monitor): undefined => (
      // switchDisplays(targetDisplayIndex, monitor.getItem().imageIndex), undefined
      undefined
    ),
    collect: () => ({ targetDisplayIndex: imageIndex }),
  });

  const onDrop = useCallback((acceptedFiles) => {
    // setNewImageFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".jpg", ".jpeg", ".png"],
  });

  // useEffect(() => {
  //   (async () => {
  //     if (croppedImage) {
  //       (async () => {
  //         const buffer = await composeImage(
  //           croppedImage,
  //           128,
  //           64,
  //           settings.contrast,
  //           settings.invert,
  //           settings.dither,
  //           settings.textEnabled,
  //           settings.text,
  //           settings.fontName
  //         );
  //         setConvertedImageBuffer(buffer);
  //       })();
  //     } else if (settings.text.length) {
  //       const buffer = await composeText(
  //         128,
  //         64,
  //         settings.dither,
  //         settings.text,
  //         settings.fontName,
  //         settings.contrast
  //       );
  //       setConvertedImageBuffer(buffer);
  //     }
  //   })();
  // }, [croppedImage, settings]);

  // const isBlack = useMemo(() => !images[imageIndex]?.find((val) => val !== 0), [
  //   images,
  // ]);
  // const allowSettings = useMemo(
  //   () => isBlack || !!newImageFile || !!settings?.text.length,
  //   [isBlack, newImageFile, settings]
  // );

  return (
    <Wrapper ref={dragRef} opacity={opacity}>
      {/* <ImagePreview
        ref={drop}
        multiplier={1}
        onClick={() => setShowSettings(true)}
        src={previewImage}
      /> */}
      <Modal visible={showSettings} setClose={() => setShowSettings(false)}>
        <DropWrapper>
          <DeleteImage src="close.png" onClick={(...args) => undefined} />
          <Drop {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <DropHere>Drop Here</DropHere>
            ) : (
              <ImagePreview multiplier={2} />
            )}
          </Drop>
        </DropWrapper>
        <Settings
          textOnly={!display.imageIsConverted}
          show={showSettings}
          setSettings={(...args) => console.log('setsettings', args)}
          settings={display.iconSettings}
          text={display.text}
          setText={(...args) => console.log('setText', args)}
          setTextSettings={(...args) => console.log('setTextSettings', args)}
          textSettings={display.textWithIconSettings}
        />
        <Row>
          <Column>
            {display && (
              <Action
                setNewRow={(newRow) => console.log('set new row', newRow) }
                pages={pages}
                action={display.actionSettings.primary}
                addPage={addPage}
                loadUserInteraction={false}
              />
            )}
          </Column>
          <Column>
            {display.actionSettings.secondary.enabled && (
              <Action
                setNewRow={(newRow) => console.log('set new row', newRow) }
                pages={pages}
                action={display.actionSettings.secondary}
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
