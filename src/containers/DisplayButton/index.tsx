import { TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";

import { ActionPreview } from "../../lib/components/ActionPreview";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { ImagePreview } from "../../lib/components/ImagePreview";
import { AppDispatchContext, AppStateContext } from "../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

interface IItem {
  pageId: string;
  displayIndex: number;
  brightness: number;
}

export const DisplayButton: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const appDispatch = useContext(AppDispatchContext);
  const page = configState.pages.byId[pageId];

  const display =
    pageId === "dbd"
      ? configState.defaultBackDisplay
      : configState.pages.byId[pageId].displayButtons[displayIndex].display;

  const [{ isDragging }, dragRef] = useDrag<
    IItem,
    any,
    { isDragging: boolean }
  >(() => ({
    type: "display",
    item: {
      pageId,
      displayIndex,
      brightness: configState.brightness,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [{ targetDisplayIndex, targetPageId }, dropRef] = useDrop<
    IItem,
    any,
    { targetDisplayIndex: number; targetPageId: string }
  >(
    () => ({
      accept: "display",
      drop: (item, monitor): void => {
        console.log("DROPPING");
        appState.ctrlDown
          ? configDispatch.copyButton({
              pageDestId: targetPageId,
              buttonDestIndex: targetDisplayIndex,
              pageSrcId: monitor.getItem().pageId,
              buttonSrcIndex: monitor.getItem().displayIndex,
            })
          : configDispatch.switchButtons({
              pageAId: targetPageId,
              buttonAIndex: targetDisplayIndex,
              pageBId: monitor.getItem().pageId,
              buttonBIndex: monitor.getItem().displayIndex,
            });
      },
      collect: () => ({
        targetDisplayIndex: displayIndex,
        targetPageId: pageId,
      }),
    }),
    [pageId, displayIndex, configDispatch]
  );

  return (
    <div ref={dragRef} className="relative">
      <CtrlDuo>
        <></>
        <TrashIcon
          onClick={async () => {
            appDispatch.openConfirm({
              title: "Delete this display button?",
              text: "Do you want to delete this display button? It will be gone forever.",
              onAccept: () =>
                configDispatch.deleteDisplayButton({
                  pageId,
                  buttonIndex: displayIndex,
                }),
            });
          }}
          className="absolute -top-3 -left-3 w-6 h-6 p-1 rounded-full bg-danger-600 hover:bg-danger-400 cursor-pointer"
        />
      </CtrlDuo>
      <Link
        to={`/displaybutton/${pageId}/${displayIndex}`}
        className={c(
          "bg-opacity-0",
          "flex items-center flex-col ",
          isDragging && "opacity-40"
        )}
      >
        <ImagePreview
          className="shadow-xl mb-2"
          $ref={dropRef}
          previewImage={display.previewImage}
        />
        <ActionPreview page={page} displayIndex={displayIndex} />
      </Link>
    </div>
  );
};
