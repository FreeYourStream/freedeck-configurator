import React, { useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";

import { IButton, IDisplay } from "../App";
import { colors } from "../definitions/colors";
import { getBase64Image } from "../lib/base64Encode";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";
import { ImagePreview } from "../lib/components/ImagePreview";
import { Column, Row, Title } from "../lib/components/Misc";
import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { EAction } from "../lib/configFile/parsePage";
import { Action } from "./ButtonSettings";

const Wrapper = styled.div<{ opacity: number }>`
  opacity: ${(p) => p.opacity};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const Text = styled.p`
  color: ${colors.white};
  font-family: "Barlow";
`;

const DisclaimerTitle = styled(Title)`
  margin-top: auto;
`;

const DisplayComponent: React.FC<{
  convertedImage: Buffer;
  addPage: (primary: boolean) => Promise<number>;
  deleteImage: () => void;
  makeDefaultBackImage: () => void;
  setOriginalImage: (newImage: Buffer) => void;
  setButtonSettings: (display: IButton) => void;
  setDisplaySettings: (display: IDisplay) => void;
  originalImage: Buffer | null;
  actionDisplay: IButton;
  imageDisplay: IDisplay;
  pageIndex: number;
  pages: number[];
  displayIndex: number;
  brightness: number;
  switchDisplays: (
    aPageIndex: number,
    bPageIndex: number,
    aDisplayIndex: number,
    bDisplayIndex: number
  ) => void;
}> = ({
  brightness,
  originalImage,
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

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "display", pageIndex, displayIndex, brightness },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ targetDisplayIndex, targetPageIndex }, drop] = useDrop({
    options: {},
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

  const opacity = useMemo(() => {
    const value = (0.5 + brightness / 512) / (isDragging ? 2 : 1);
    return value;
  }, [isDragging, brightness]);

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
          height={720}
          width={628}
        >
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
          </ContextMenu>
          <TabView
            tabs={["Display Settings", "Button Settings"]}
            renderTab={(tabName) => (
              <>
                <ModalBody visible={tabName === "Display Settings"}>
                  <Title divider size={3}>
                    Display Settings
                  </Title>
                  <DisplaySettingsContainer
                    ref={menuRef}
                    display={imageDisplay}
                    originalImage={originalImage}
                    setOriginalImage={setOriginalImage}
                    setImageSettings={(imageSettings) =>
                      setDisplaySettings({ ...imageDisplay, imageSettings })
                    }
                    setTextSettings={(textSettings) =>
                      setDisplaySettings({
                        ...imageDisplay,
                        textSettings,
                      })
                    }
                    setTextWithIconSettings={(textWithIconSettings) =>
                      setDisplaySettings({
                        ...imageDisplay,
                        textWithIconSettings,
                      })
                    }
                  />
                </ModalBody>
                <ModalBody visible={tabName === "Button Settings"}>
                  <Title divider size={3}>
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
                      {actionDisplay.primary.mode !== EAction.text && (
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
                      )}
                    </Column>
                  </Row>{" "}
                  <DisclaimerTitle>Disclaimer:</DisclaimerTitle>
                  <Text>
                    If you have a non-US keyboard, the buttons recognized will
                    not show the buttons on your keyboard. But it will still
                    work like expected :) I would love to show the buttons as
                    they are on your keyboard, but that is not so easy as i
                    hoped. If you can help, please do it!
                  </Text>
                </ModalBody>
              </>
            )}
          />
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
