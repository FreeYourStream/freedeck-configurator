import React, { useContext, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { colors } from "../definitions/colors";
import { EAction } from "../definitions/modes";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";
import { ImagePreview } from "../lib/components/ImagePreview";
import { Column, Row, Title } from "../lib/components/Misc";
import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import { DispatchContext, StateContext } from "../state";
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

export const Display: React.FC<{
  pageIndex: number;
  displayIndex: number;
}> = ({ pageIndex, displayIndex }) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const display = state.displaySettingsPages[pageIndex][displayIndex];
  const button = state.buttonSettingsPages[pageIndex][displayIndex];
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: "display",
      pageIndex,
      displayIndex,
      brightness: state.brightness,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ targetDisplayIndex, targetPageIndex }, drop] = useDrop({
    options: {},
    accept: "display",
    drop: (item, monitor): void =>
      dispatch.switchButtons({
        pageAIndex: targetPageIndex,
        buttonAIndex: targetDisplayIndex,
        pageBIndex: monitor.getItem().pageIndex,
        buttonBIndex: monitor.getItem().displayIndex,
      }),
    collect: () => ({
      targetDisplayIndex: displayIndex,
      targetPageIndex: pageIndex,
    }),
  });

  const opacity = useMemo(() => {
    const value = (0.5 + state.brightness / 512) / (isDragging ? 2 : 1);
    return value;
  }, [isDragging, state.brightness]);

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
        src={display.previewImage}
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
              onClick={() =>
                dispatch.deleteImage({
                  buttonIndex: displayIndex,
                  pageIndex: pageIndex,
                })
              }
              dangerous
            ></ContextMenuItem>
            <ContextMenuItem
              text="Make default back Image"
              icon="gi/GiBackForth"
              onClick={() =>
                dispatch.makeDefaultBackButton({
                  pageIndex,
                  buttonIndex: displayIndex,
                })
              }
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
                    pageIndex={pageIndex}
                    displayIndex={displayIndex}
                  />
                </ModalBody>
                <ModalBody visible={tabName === "Button Settings"}>
                  <Title divider size={3}>
                    Button Settings
                  </Title>
                  <Row>
                    <Column>
                      <Action
                        primary={true}
                        title="Short press"
                        pageIndex={pageIndex}
                        buttonIndex={displayIndex}
                        pageCount={state.buttonSettingsPages.length}
                        action={button.primary}
                        loadUserInteraction={false}
                      />
                    </Column>
                    <Column>
                      {button.primary.mode !== EAction.text && (
                        <Action
                          primary={false}
                          title="Long press"
                          pageIndex={pageIndex}
                          buttonIndex={displayIndex}
                          pageCount={state.buttonSettingsPages.length}
                          action={button.secondary}
                          loadUserInteraction={false}
                        />
                      )}
                    </Column>
                  </Row>{" "}
                  <DisclaimerTitle>
                    Disclaimer for Firefox and Safari:
                  </DisclaimerTitle>
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
