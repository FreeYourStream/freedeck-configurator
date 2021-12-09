import c from "clsx";
import React, { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Link } from "react-router-dom";

import { ActionPreview } from "../../lib/components/ActionPreview";
import { ImagePreview } from "../../lib/components/ImagePreview";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

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
    <Link
      to={`/displaybutton/${pageId}/${displayIndex}`}
      ref={dragRef}
      className={c(
        "flex items-center flex-col relative shadow-xl",
        isDragging && "opacity-40"
      )}
    >
      <ImagePreview $ref={drop} previewImage={display.previewImage} />
      <ActionPreview pageId={pageId} displayIndex={displayIndex} />
    </Link>
  );
};
