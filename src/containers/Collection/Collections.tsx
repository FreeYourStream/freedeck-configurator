import React, { useContext } from "react";

import { TitleBox } from "../../lib/components/Title";
import { ConfigStateContext } from "../../states/configState";
import { Collection } from ".";

export const Collections: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configState = useContext(ConfigStateContext);
  return (
    <div className="flex flex-col justify-center items-center p-12">
      <TitleBox title="Collections" center className="w-full">
        <div className="flex flex-wrap justify-evenly items-center w-full h-full mb-16">
          {Object.entries(configState.collections.byId).map(
            ([id, collection]) => (
              <Collection key={id} collectionId={id} />
            )
          )}
        </div>
      </TitleBox>
    </div>
  );
};
