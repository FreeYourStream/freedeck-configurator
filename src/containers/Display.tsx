import Jimp from "jimp";
import React, { useCallback, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";

import { IButton, IDisplay } from "../App";
import { ImagePreview } from "../components/bwImagePreview";
import { DropDisplay } from "../components/dropDisplay";
import { Column, Row } from "../components/misc";
import { Modal } from "../components/modal";
import { handleFileSelect } from "../lib/fileSelect";
import { getBase64Image } from "../lib/uint8ToBase64";
import { Action } from "./Action";
import { Settings } from "./Settings";

const Wrapper = styled.div<{ opacity: number }>`
  opacity: ${(p) => p.opacity};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  z-index: 10;
`;

const DisplayComponent: React.FC<{
  image: Buffer;
  addPage: (primary: boolean) => Promise<number>;
  deleteImage: () => void;
  setOriginalImage: (newImage: Buffer) => void;
  setDisplayAction: (display: IButton) => void;
  setDisplayImage: (display: IDisplay) => void;
  hasOriginalImage: boolean;
  actionDisplay: IButton;
  imageDisplay: IDisplay;
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

  return (
    <Wrapper ref={dragRef} opacity={opacity}>
      <ImagePreview
        ref={drop}
        multiplier={1}
        onClick={() => setShowSettings(true)}
        src={previewImage}
      />
      {showSettings && (
        <Modal
          title={`Page #${pageIndex} | Display #${displayIndex}`}
          visible={showSettings}
          setClose={() => setShowSettings(false)}
        >
          <DropDisplay
            deleteImage={deleteImage}
            onDrop={onDrop}
            previewImage={previewImage}
          />
          <Settings
            textOnly={!hasOriginalImage}
            setImageSettings={(imageSettings) =>
              setDisplayImage({ ...imageDisplay, imageSettings })
            }
            imageSettings={imageDisplay.imageSettings}
            textSettings={imageDisplay.textSettings}
            textWithIconSettings={imageDisplay.textWithIconSettings}
            setTextSettings={(textSettings) =>
              setDisplayImage({
                ...imageDisplay,
                textSettings,
              })
            }
            setTextWithIconSettings={(textWithIconSettings) =>
              setDisplayImage({ ...imageDisplay, textWithIconSettings })
            }
          />
          <Row>
            <Column>
              <Action
                setActionSetting={(primary) =>
                  setDisplayAction({ ...actionDisplay, primary })
                }
                title="Short press"
                pages={pages}
                action={actionDisplay.primary}
                addPage={() => addPage(true)}
                loadUserInteraction={false}
              />
            </Column>
            <Column>
              <Action
                setActionSetting={(secondary) =>
                  setDisplayAction({ ...actionDisplay, secondary })
                }
                title="Long press"
                pages={pages}
                action={actionDisplay.secondary}
                addPage={() => addPage(false)}
                loadUserInteraction={false}
              />
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
