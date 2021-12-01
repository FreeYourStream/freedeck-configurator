import c from "clsx";
import React, { useContext } from "react";

import { Value } from "../../lib/components/LabelValue";
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
export const Page: React.FC<IProps> = ({ pageId, collectionIndex }) => {
  const configState = useContext(ConfigStateContext);
  const page = configState.pages.byId[pageId];
  return (
    <div
      id={`page_${pageId}`}
      className="relative p-2 m-6 rounded-3xl bg-gray-700 shadow-lg"
    >
      <div className="flex justify-between pl-10 py-4 pr-4">
        {page.name ? (
          <Value>{page.name}</Value>
        ) : (
          <Value className="text-gray-300">{pageId.slice(-4)}</Value>
        )}
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
  );
};
