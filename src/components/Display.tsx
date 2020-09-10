import Jimp from "jimp";
import React, { useCallback, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";

import { IButton, IDisplay } from "../App";
import { getBase64Image } from "../lib/base64Encode";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettings } from "../lib/components/DisplaySettings";
import { DropDisplay } from "../lib/components/DropDisplay";
import { ImagePreview } from "../lib/components/ImagePreview";
import { Column, Row, Title } from "../lib/components/Misc";
import { Modal, ModalBody } from "../lib/components/Modal";
import { handleFileSelect } from "../lib/handleFileSelect";
import { Action } from "./Action";

const Wrapper = styled.div<{ opacity: number }>`
  opacity: ${(p) => p.opacity};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const DisplayComponent: React.FC<{
  convertedImage: Buffer;
  addPage: (primary: boolean) => Promise<number>;
  deleteImage: () => void;
  makeDefaultBackImage: () => void;
  setOriginalImage: (newImage: Buffer) => void;
  setButtonSettings: (display: IButton) => void;
  setDisplaySettings: (display: IDisplay) => void;
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
  convertedImage,
  addPage,
  deleteImage,
  setOriginalImage,
  setButtonSettings,
  setDisplaySettings,
  actionDisplay,
  imageDisplay,
  pageIndex,
  pages,
  displayIndex,
  switchDisplays,
  makeDefaultBackImage,
  // connectDragSource,
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const previewImage = useMemo(() => getBase64Image(convertedImage), [
    convertedImage,
  ]);

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
        .getBufferAsync("image/png");
      setOriginalImage(resizedBuffer);
    },
    [setOriginalImage]
  );

  const menuId = `${pageIndex}:${displayIndex}`;
  let menuRef = useContextMenuTrigger<HTMLDivElement>({
    menuId,
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
        <Modal
          title={`Page ${pageIndex} | Display and Button ${displayIndex}`}
          visible={showSettings}
          setClose={() => setShowSettings(false)}
          minHeight={900}
        >
          <ModalBody>
            <ContextMenu menuId={menuId}>
              <ContextMenuItem
                text="Delete image"
                icon="fa/FaTrash"
                onClick={() => deleteImage()}
                dangerous
              ></ContextMenuItem>
              <ContextMenuItem
                text="Make default back Image"
                icon="gi/GiBackForth"
                onClick={() => makeDefaultBackImage()}
                dangerous
              ></ContextMenuItem>
              <ContextMenuItem
                text="Lorem Ipsum dolor"
                icon="ri/RiFeedbackFill"
                onClick={() => makeDefaultBackImage()}
              ></ContextMenuItem>
              <ContextMenuItem
                text="Sit amet latein ist cool"
                icon="md/MdBackup"
                onClick={() => makeDefaultBackImage()}
              ></ContextMenuItem>
            </ContextMenu>
            <DropDisplay
              ref={menuRef}
              onDrop={onDrop}
              previewImage={previewImage}
            />
            <Title divider big>
              Display Settings
            </Title>
            <DisplaySettings
              textOnly={!hasOriginalImage}
              setImageSettings={(imageSettings) =>
                setDisplaySettings({ ...imageDisplay, imageSettings })
              }
              imageSettings={imageDisplay.imageSettings}
              textSettings={imageDisplay.textSettings}
              textWithIconSettings={imageDisplay.textWithIconSettings}
              setTextSettings={(textSettings) =>
                setDisplaySettings({
                  ...imageDisplay,
                  textSettings,
                })
              }
              setTextWithIconSettings={(textWithIconSettings) =>
                setDisplaySettings({ ...imageDisplay, textWithIconSettings })
              }
            />
            <Title divider big>
              Button Settings
            </Title>
            <Row>
              <Column>
                <Action
                  setActionSetting={(primary) =>
                    setButtonSettings({ ...actionDisplay, primary })
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
                    setButtonSettings({ ...actionDisplay, secondary })
                  }
                  title="Long press"
                  pages={pages}
                  action={actionDisplay.secondary}
                  addPage={() => addPage(false)}
                  loadUserInteraction={false}
                />
              </Column>
            </Row>
          </ModalBody>
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
