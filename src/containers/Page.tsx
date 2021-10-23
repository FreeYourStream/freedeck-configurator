import { TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { DisplayButton } from "./DisplayButton";
import { Modal } from "../lib/components/Modal";
import { AppStateContext } from "../states/appState";

interface IProps {
  pageIndex: number;
}
export const Page: React.FC<IProps> = ({ pageIndex }) => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);

  const configDispatch = useContext(ConfigDispatchContext);
  const [isOpen, setOpen] = useState(false);
  return (
    <div
      id={`page_${pageIndex}`}
      className="relative p-12 m-6 rounded-2xl rounded-tl-3xl bg-gray-700 shadow-lg"
    >
      <Modal
        isOpen={isOpen}
        onAccept={() => {
          configDispatch.deletePage(pageIndex);
          setOpen(false);
        }}
        onAbort={() => setOpen(false)}
        title="Delete this page?"
        text="Do you want to delete this page? It will be gone forever"
      />
      <div className="flex justify-between">
        <div className="absolute flex items-center justify-center w-9 h-9 shadow-md bg-gray-400 rounded-full top-2 left-2 ">
          <div className="text-xl font-bold text-center text-white align-middle">
            {pageIndex + 1}
          </div>
        </div>
        <div
          className="absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-lg bg-danger-600 hover:bg-danger-400 -top-4 -right-4"
          onClick={async () => {
            if (appState.ctrlDown) configDispatch.deletePage(pageIndex);
            else setOpen(true);
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
