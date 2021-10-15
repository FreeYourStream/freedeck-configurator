import { TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import { Display } from "./DisplayButton";
import { Icon } from "../lib/components/Button";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

interface IProps {
  pageIndex: number;
}

export const Page: React.FC<IProps> = ({ pageIndex }) => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <div
      id={`page_${pageIndex}`}
      className="relative p-12 m-6 rounded-2xl rounded-tl-3xl bg-gray-2 shadow-lg"
    >
      <div className="flex justify-between">
        <div className="absolute flex items-center justify-center w-9 h-9 border-2 shadow-md border-white rounded-full top-2 left-2">
          <div className="text-xl font-bold text-center text-white align-middle">
            {pageIndex + 1}
          </div>
        </div>
        <div
          className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-lg bg-danger-3 hover:bg-danger-5 -top-4 -right-4"
          onClick={() => {
            const deleteConfirmed =
              appState.ctrlDown ||
              window.confirm("Do you really want to delete this page forever?");
            if (deleteConfirmed) configDispatch.deletePage(pageIndex);
          }}
        >
          <TrashIcon className="w-6 h-6" />
        </div>
      </div>
      <div
        className={c(
          "grid gap-4",
          `grid-cols-${configState.width}`,
          `grid-rows-${configState.height}`
        )}
      >
        <DndProvider backend={Backend}>
          {configState.displaySettingsPages[pageIndex].map(
            (imageDisplay, displayIndex) => (
              <Display
                key={displayIndex}
                displayIndex={displayIndex}
                pageIndex={pageIndex}
              />
            )
          )}
        </DndProvider>
      </div>
    </div>
  );
};
