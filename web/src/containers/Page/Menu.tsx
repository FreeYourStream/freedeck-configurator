import {
  CogIcon,
  CollectionIcon,
  MenuIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";

import { iconSize } from "../../definitions/iconSizes";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { FDMenu } from "../../lib/components/Menu";
import { Modal } from "../../lib/components/Modal";
import { AppStateContext } from "../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

export const PageMenu: React.FC<{ pageId: string }> = ({ pageId }) => {
  const nav = useNavigate();
  const appState = useContext(AppStateContext);
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  return (
    <div className="flex items-center justify-center w-8 h-8  cursor-pointer shadow-lg">
      <Modal
        isOpen={deleteOpen}
        onAccept={() => {
          configDispatch.deletePage(pageId);
          setDeleteOpen(false);
        }}
        onAbort={() => setDeleteOpen(false)}
        title="Delete this page?"
        text="Do you want to delete this page? It will be gone forever"
      />
      <CtrlDuo>
        <FDMenu
          entries={[
            {
              title: "Settings",
              prefix: <CogIcon className={c(iconSize)} />,
              onClick: () => nav(`/page/${pageId}`),
            },
            {
              title: "Add to collection",
              prefix: <CollectionIcon className={c(iconSize)} />,
              disabled: !!configState.pages.byId[pageId].isInCollection,
              onClick: () => {
                console.log("COLLECTION MAKER");
                configDispatch.movePageToCollection({
                  collectionId: "testid",
                  pageId,
                });
              },
            },
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
            if (appState.ctrlDown) configDispatch.deletePage(pageId);
            else setDeleteOpen(true);
          }}
          className="w-9 h-9 p-1.5 rounded-full bg-danger-600 hover:bg-danger-400"
        />
      </CtrlDuo>
    </div>
  );
};
