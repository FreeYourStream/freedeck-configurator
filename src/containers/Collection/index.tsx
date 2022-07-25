import React, { useContext } from "react";
import { useDrop } from "react-dnd";

import { Label } from "../../lib/components/LabelValue";
import { TitleInput } from "../../lib/components/TitleInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { Page } from "../Page";
import { CollectionMenu } from "./Menu";

export const Collection: React.FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { renameCollection, setPageCollection } = useContext(
    ConfigDispatchContext
  );
  const collection = configState.collections.byId[collectionId];
  const [{ targetCollectionId }, drop] = useDrop<
    { pageId: string },
    {},
    { targetCollectionId: string }
  >({
    accept: "page",
    drop: (item, monitor): any => {
      if (!collection.pages.find((p) => p === monitor.getItem().pageId))
        setPageCollection({
          pageId: monitor.getItem().pageId,
          collectionId: targetCollectionId,
        });
      return {};
    },
    collect: () => ({
      targetCollectionId: collectionId,
    }),
  });
  return (
    <div
      ref={drop}
      className="flex items-center flex-col bg-gray-500 p-6 rounded-3xl m-8"
    >
      <div className="flex items-center justify-between w-full">
        <TitleInput
          onChange={(name) => renameCollection({ collectionId, name })}
          value={collection.name}
          placeholder={`${collectionId.slice(-4)} - Click to edit`}
        />
        <CollectionMenu collectionId={collectionId} />
      </div>
      <div className="flex flex-wrap justify-evenly items-center">
        {collection.pages.length ? (
          collection.pages.map((pageId) => (
            <Page key={pageId} pageId={pageId} />
          ))
        ) : (
          <div className="flex flex-col p-8 w-80 h-40 justify-center items-center">
            <Label hint='Add pages to this collection by clicking their menu button -> "Settings"'>
              This collection is Empty
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};
