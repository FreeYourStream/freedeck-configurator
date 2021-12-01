import React, { useContext } from "react";

import { Title } from "../../lib/components/Title";
import { getCollectionName } from "../../lib/util";
import { ConfigStateContext } from "../../states/configState";
import { Page } from "../Page";
import { CollectionMenu } from "./Menu";
import { Collection } from ".";

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
              <Collection collectionId={id} />
            )
          )}
        </div>
      </div>
    </div>
  );
};
