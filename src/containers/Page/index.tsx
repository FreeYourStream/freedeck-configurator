import c from "clsx";
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { ConfigStateContext } from "../../states/configState";
import { DisplayButton } from "../DisplayButton";
import { PageMenu } from "./Menu";

interface IProps {
  pageIndex: number;
}
export const Page: React.FC<IProps> = ({ pageIndex }) => {
  const configState = useContext(ConfigStateContext);

  return (
    <div
      id={`page_${pageIndex}`}
      className="relative p-2 m-6 rounded-3xl bg-gray-700 shadow-lg"
    >
      <div className="flex justify-between">
        <div className="flex items-center justify-center w-9 h-9 shadow-md bg-gray-400 rounded-full top-2 left-2 ">
          <div className="text-xl font-bold text-center text-white align-middle">
            {pageIndex + 1}
          </div>
        </div>
        <PageMenu pageIndex={pageIndex} />
      </div>
      <div
        className={c(
          "p-10 pt-2",
          "grid gap-8",
          `grid-cols-${configState.width}`,
          `grid-rows-${configState.height}`
        )}
      >
        <DndProvider backend={Backend}>
          {configState.pages[pageIndex].map((db, displayIndex) => (
            <DisplayButton
              key={displayIndex}
              displayIndex={displayIndex}
              pageIndex={pageIndex}
            />
          ))}
        </DndProvider>
      </div>
    </div>
  );
};
