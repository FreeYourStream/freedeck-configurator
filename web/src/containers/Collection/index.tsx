import React, { useContext } from "react";

import { Title } from "../../lib/components/Title";
import { TitleInput } from "../../lib/components/TitleInput";
import { getCollectionName } from "../../lib/util";
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
  const { renameCollection } = useContext(ConfigDispatchContext);
  const collection = configState.collections.byId[collectionId];
  return (
    <div className="flex items-center flex-col bg-gray-500 p-6 rounded-3xl m-8">
      <div className="flex items-center justify-between w-full">
        <TitleInput
          onChange={(name) => renameCollection({ collectionId, name })}
          value={collection.name}
          placeholder={collectionId.slice(-4)}
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
            <Title>This collection is Empty</Title>
            <div className="text-center">
              Add pages to this collection by clicking their menu button and
              then "Settings"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
