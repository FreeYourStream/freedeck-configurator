import React, { useContext } from "react";

import { Title } from "../../lib/components/Title";
import { ConfigStateContext } from "../../states/configState";
import { Page } from "../Page";
import { CollectionMenu } from "./Menu";

export const Collections: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configState = useContext(ConfigStateContext);
  return (
    <div>
      <div className="flex flex-col justify-center items-center pt-12 ">
        <Title>Collections</Title>
        <div className="flex flex-wrap justify-evenly items-center w-full h-full pt-6 pb-16">
          {Object.entries(configState.collections.byId).map(
            ([id, collection]) => (
              <div
                key={id}
                className="flex items-center flex-col bg-gray-500 pt-6 rounded-3xl mx-16"
              >
                <div className="flex justify-center items-center gap-4">
                  <div className="bg-gray-400 px-4 py-1 rounded-lg">
                    <Title>{collection.name}</Title>
                  </div>
                  <CollectionMenu collectionId={id} />
                </div>
                <div className="flex flex-wrap justify-evenly items-center">
                  {collection.pages.map((pageId) => (
                    <Page key={pageId} pageId={pageId} />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
