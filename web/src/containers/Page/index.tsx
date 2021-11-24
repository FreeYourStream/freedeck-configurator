import c from "clsx";
import React, { useContext } from "react";

import { TextInput } from "../../lib/components/TextInput";
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
  const { renamePage } = useContext(ConfigDispatchContext);
  return (
    <div
      id={`page_${page.id}`}
      className="relative p-2 m-6 rounded-3xl bg-gray-700 shadow-lg"
    >
      <div className="flex justify-between pl-10 py-4 pr-4">
        <TextInput
          className="w-full mr-6"
          value={page.name}
          placeholder={page.id.slice(-4) + " - Click to change name"}
          onChange={(value) => renamePage({ pageId, name: value })}
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
  );
};
