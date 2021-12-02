import c from "clsx";
import React, { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Value } from "../../lib/components/LabelValue";
import { TitleInput } from "../../lib/components/TitleInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { DisplayButton } from "../DisplayButton";
import { PageMenu } from "./Menu";

interface IProps {
  pageId: string;
  collectionIndex?: number;
}
export const Page: React.FC<IProps> = ({ pageId }) => {
  const configState = useContext(ConfigStateContext);
  const { renamePage, switchPages } = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type: "page",
      pageId,
      collectionId: page.isInCollection,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [{ targetPageId, collectionId }, drop] = useDrop({
    options: {},
    accept: "page",
    drop: (item, monitor): void => {
      if (!!monitor.getItem().collectionId === !!collectionId)
        switchPages({
          pageAId: targetPageId,
          pageBId: monitor.getItem().pageId,
        });
    },
    collect: () => ({
      targetPageId: pageId,
      collectionId: page.isInCollection,
    }),
  });
  return (
    <div
      ref={dragRef}
      id={`page_${pageId}`}
      className="relative p-2 m-6 rounded-3xl bg-gray-700 shadow-lg"
    >
      <div ref={drop}>
        <div className="flex justify-between pl-10 py-4 pr-4">
          <TitleInput
            onChange={(name) => renamePage({ pageId, name })}
            value={page.name}
            disabled={page.isStartPage}
            placeholder={`${pageId.slice(-4)} - Click to edit`}
          />
          <PageMenu pageId={pageId} />
        </div>
        <div
          className={c(
            "p-10 pt-2",
            "grid gap-8",
            `grid-cols-${configState.width}`,
            `grid-rows-${configState.height}`
          )}
        >
          {configState.pages.byId[pageId].displayButtons.map(
            (db, displayIndex) => (
              <DisplayButton
                key={displayIndex}
                displayIndex={displayIndex}
                pageId={pageId}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
