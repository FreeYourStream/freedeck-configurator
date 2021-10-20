import {
  AdjustmentsIcon,
  ArrowCircleLeftIcon,
  PhotographIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { useDrag, useDrop } from "react-dnd";
import { ActionPreview } from "../lib/components/ActionPreview";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { ImagePreview } from "../lib/components/ImagePreview";
import { Modal } from "../lib/components/Modal";
import { TabView } from "../lib/components/TabView";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { ButtonSettingsContainer } from "./ButtonSettings";
import { DisplaySettingsContainer } from "./DisplaySettings";

export const DisplayButton: React.FC<{
  pageIndex: number;
  displayIndex: number;
}> = ({ pageIndex, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);

  const [showSettings, setShowSettings] = useState<boolean>(false);
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

  const menuId = `${pageIndex}:${displayIndex}`;
  let menuRef = useContextMenuTrigger<HTMLDivElement>({
    menuId,
  });

  return (
    <div
      ref={dragRef}
      className={c(
        "flex items-center flex-col relative shadow-xl",
        isDragging && "opacity-40"
      )}
    >
      <ImagePreview
        $ref={drop}
        onClick={() => setShowSettings(true)}
        pageIndex={pageIndex}
        displayIndex={displayIndex}
      />
      <ActionPreview pageIndex={pageIndex} displayIndex={displayIndex} />

      {showSettings && (
        <Modal
          className="w-modal"
          title={`Page ${pageIndex + 1} Display ${displayIndex + 1}`}
          visible={showSettings}
          setClose={() => setShowSettings(false)}
        >
          <ContextMenu menuId={menuId}>
            <ContextMenuItem
              text="Delete image"
              prefix={<TrashIcon className="h-6 w-6 " />}
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
              prefix={<ArrowCircleLeftIcon className="h-6 w-6" />}
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
    </div>
  );
};
