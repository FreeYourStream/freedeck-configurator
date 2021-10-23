import { TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { DisplayButton } from "./DisplayButton";
import { confirm } from "../lib/components/confirmAlert";

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
      className="relative p-12 m-6 rounded-2xl rounded-tl-3xl bg-gray-700 shadow-lg"
    >
      <div className="flex justify-between">
        <div className="absolute flex items-center justify-center w-9 h-9 shadow-md bg-gray-400 rounded-full top-2 left-2 ">
          <div className="text-xl font-bold text-center text-white align-middle">
            {pageIndex + 1}
          </div>
        </div>
        <div
          className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-lg bg-danger-600 hover:bg-danger-400 -top-4 -right-4"
          onClick={async () => {
            const deleteConfirmed =
              appState.ctrlDown ||
              (await confirm(
                "Do you really want to delete this page forever?",
                "Tipp: Hold Ctrl to skip this dialog next time"
              ));
            if (deleteConfirmed) configDispatch.deletePage(pageIndex);
          }}
        >
          <TrashIcon className="w-6 h-6" />
        </div>
      </div>
      <div
        className={c(
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
