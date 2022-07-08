import { TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";

import { ActionPreview } from "../../lib/components/ActionPreview";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { ImagePreview } from "../../lib/components/ImagePreview";
import { Modal } from "../../lib/components/Modal";
import { AppStateContext } from "../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

export const DisplayButton: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];
  const [deleteOpen, setDeleteOpen] = useState(false);
  const display =
    pageId === "dbd"
      ? configState.defaultBackDisplay
      : configState.pages.byId[pageId].displayButtons[displayIndex].display;
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
          }),
    collect: () => ({
      targetDisplayIndex: displayIndex,
      targetPageId: pageId,
    }),
  });

  return (
    <div className="relative">
      <CtrlDuo>
        <></>
        <TrashIcon
          onClick={async () => {
            setDeleteOpen(true);
          }}
          className="absolute -top-3 -left-3 w-6 h-6 p-1 rounded-full bg-danger-600 hover:bg-danger-400 cursor-pointer"
        />
      </CtrlDuo>
      <Modal
        isOpen={deleteOpen}
        onAccept={() => {
          configDispatch.deleteDisplayButton({
            pageId,
            buttonIndex: displayIndex,
          });
          setDeleteOpen(false);
        }}
        onAbort={() => setDeleteOpen(false)}
        title="Delete this display button?"
        text="Do you want to delete this display button? It will be gone forever"
      />
      <Link
        to={`/displaybutton/${pageId}/${displayIndex}`}
        ref={dragRef}
        className={c(
          "bg-opacity-0",
          "flex items-center flex-col ",
          isDragging && "opacity-40"
        )}
      >
        <ImagePreview
          className="shadow-xl mb-2"
          $ref={drop}
          previewImage={display.previewImage}
        />
        <ActionPreview page={page} displayIndex={displayIndex} />
      </Link>
    </div>
  );
};
