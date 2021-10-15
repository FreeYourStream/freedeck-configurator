import {
  AdjustmentsIcon,
  PhotographIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import React, { useContext, useMemo, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { ButtonSettingsContainer } from "./ButtonSettings";
import { colors } from "../definitions/colors";
import { EAction } from "../definitions/modes";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";
import { ImagePreview } from "../lib/components/ImagePreview";
import { Column, Row, Title } from "../lib/components/Misc";
import { Modal, ModalBody } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

const Wrapper = styled.div<{ opacity: number }>`
  opacity: ${(p) => p.opacity};
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

export const Display: React.FC<{
  pageIndex: number;
  displayIndex: number;
}> = ({ pageIndex, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const display = configState.displaySettingsPages[pageIndex][displayIndex];
  const button = configState.buttonSettingsPages[pageIndex][displayIndex];
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: "display",
      pageIndex,
      displayIndex,
      brightness: configState.brightness,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ targetDisplayIndex, targetPageIndex }, drop] = useDrop({
    options: {},
    accept: "display",
    drop: (item, monitor): void =>
      configDispatch.switchButtons({
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
    const value = (0.5 + configState.brightness / 512) / (isDragging ? 2 : 1);

    return value;
  }, [isDragging, configState.brightness]);
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
          title={`Page ${pageIndex + 1} -> Display ${displayIndex + 1}`}
          visible={showSettings}
          setClose={() => setShowSettings(false)}
          height={720}
          width={670}
        >
          <ContextMenu menuId={menuId}>
            <ContextMenuItem
              text="Delete image"
              icon="fa/FaTrash"
              onClick={() =>
                configDispatch.deleteImage({
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
                configDispatch.makeDefaultBackButton({
                  pageIndex,
                  buttonIndex: displayIndex,
                })
              }
              dangerous
            ></ContextMenuItem>
          </ContextMenu>
          <TabView
            tabs={[
              {
                title: "Display Settings",
                prefix: <PhotographIcon className="h-6 w-6" />,
                content: (
                  <DisplaySettingsContainer
                    ref={menuRef}
                    pageIndex={pageIndex}
                    displayIndex={displayIndex}
                  />
                ),
              },
              {
                title: "Button Settings",
                prefix: <AdjustmentsIcon className="h-6 w-6" />,
                content: (
                  <ButtonSettingsContainer
                    pageIndex={pageIndex}
                    displayIndex={displayIndex}
                  />
                ),
              },
            ]}
          />
        </Modal>
      )}
    </Wrapper>
  );
};
