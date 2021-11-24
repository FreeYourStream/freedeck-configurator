import { AdjustmentsIcon, PhotographIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import { ActionPreview } from "../lib/components/ActionPreview";
import { ImagePreview } from "../lib/components/ImagePreview";
import { TabView } from "../lib/components/TabView";
import { FDWindow } from "../lib/components/Window";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { ButtonSettingsContainer } from "./ButtonSettings";
import { DisplaySettingsContainer } from "./DisplaySettings";

export const DisplayButton: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const display =
    pageId === "dbd"
      ? configState.defaultBackDisplay
      : configState.pages.byId[pageId].displayButtons[displayIndex].display;
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: "display",
      pageId,
      displayIndex,
      brightness: configState.brightness,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ targetDisplayIndex, targetPageId }, drop] = useDrop({
    options: {},
    accept: "display",
    drop: (item, monitor): void =>
      configDispatch.switchButtons({
        pageAId: targetPageId,
        buttonAIndex: targetDisplayIndex,
        pageBId: monitor.getItem().pageId,
        buttonBIndex: monitor.getItem().displayIndex,
      }),
    collect: () => ({
      targetDisplayIndex: displayIndex,
      targetPageId: pageId,
    }),
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
        previewImage={display.previewImage}
      />
      <ActionPreview pageId={pageId} displayIndex={displayIndex} />

      {
        <FDWindow
          className="w-dp-settings"
          title={`Page ${pageId + 1} Display ${displayIndex + 1}`}
          visible={showSettings}
          setClose={() => setShowSettings(false)}
        >
          <TabView
            className="h-dp-settings"
            tabs={[
              {
                title: "Display Settings",
                prefix: <PhotographIcon className="h-6 w-6" />,
                content: (
                  <DisplaySettingsContainer
                    pageId={pageId}
                    displayIndex={displayIndex}
                  />
                ),
              },
              {
                title: "Button Settings",
                prefix: <AdjustmentsIcon className="h-6 w-6" />,
                content: (
                  <ButtonSettingsContainer
                    pageId={pageId}
                    displayIndex={displayIndex}
                  />
                ),
              },
            ]}
          />
        </FDWindow>
      }
    </div>
  );
};
