import { MenuIcon, ShareIcon, TrashIcon } from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";

import { iconSize } from "../../definitions/iconSizes";
import { usePageCreateMutation } from "../../generated/types-and-hooks";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { FDMenu } from "../../lib/components/Menu";
import { Modal } from "../../lib/components/Modal";
import { AppStateContext } from "../../states/appState";
import { ConfigDispatchContext } from "../../states/configState";
import { PublishPage } from "./Publish";

export const PageMenu: React.FC<{ pageIndex: number }> = ({ pageIndex }) => {
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  return (
    <div className="flex items-center justify-center w-8 h-8  cursor-pointer shadow-lg">
      <Modal
        isOpen={deleteOpen}
        onAccept={() => {
          // mutate({
          //   variables: {
          //     input: {
          //       data: configState.pages[pageIndex],
          //       height: configState.height,
          //       width: configState.width,
          //       name: "test",
          //       previewActions: configState.pages[pageIndex].map(
          //         (page) => page.button
          //       ),
          //       previewImages: configState.pages[pageIndex].map(
          //         (page) => page.display.previewImage
          //       ),
          //       tags: [
          //         "test1",
          //         "test2",
          //         "test3",
          //         "test4",
          //         "test5",
          //         "test7",
          //         "test1221",
          //       ],
          //     },
          //   },
          // });
          configDispatch.deletePage(pageIndex);
          setDeleteOpen(false);
        }}
        onAbort={() => setDeleteOpen(false)}
        title="Delete this page?"
        text="Do you want to delete this page? It will be gone forever"
      />

      {process.env.REACT_APP_ENABLE_API === "true" && (
        <PublishPage
          isOpen={publishOpen}
          setOpen={(val) => setPublishOpen(val)}
          pageIndex={pageIndex}
        />
      )}

      <CtrlDuo>
        <FDMenu
          entries={[
            {
              title: "Delete",
              prefix: <TrashIcon className={c(iconSize, "text-danger-400")} />,
              onClick: () => setDeleteOpen(true),
            },
            {
              title: "Publish",
              prefix: <ShareIcon className={iconSize} />,
              disabled: process.env.REACT_APP_ENABLE_API !== "true",
              onClick: () => setPublishOpen(true),
            },
          ]}
        >
          <MenuIcon className="w-9 h-9 p-1.5 rounded-full bg-gray-400 hover:bg-gray-300" />
        </FDMenu>
        <TrashIcon
          onClick={async () => {
            if (appState.ctrlDown) configDispatch.deletePage(pageIndex);
            else setDeleteOpen(true);
          }}
          className="w-9 h-9 p-1.5 rounded-full bg-danger-600 hover:bg-danger-400"
        />
      </CtrlDuo>
    </div>
  );
};
