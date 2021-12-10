import {
  CogIcon,
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
import { ConfigDispatchContext } from "../../states/configState";

// import { PublishPage } from "./Publish";

export const CollectionMenu: React.FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const nav = useNavigate();
  const configDispatch = useContext(ConfigDispatchContext);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="flex items-center justify-center w-8 h-8  cursor-pointer shadow-lg">
      <Modal
        isOpen={deleteOpen}
        onAccept={() => {
          configDispatch.deleteCollection({ collectionId });
          setDeleteOpen(false);
        }}
        onAbort={() => setDeleteOpen(false)}
        title="Delete this collection?"
        text="Do you want to delete this collection? It will be gone forever"
      />

      {/* {process.env.REACT_APP_ENABLE_API === "true" && (
        <PublishCollection
          isOpen={publishOpen}
          setOpen={(val) => setPublishOpen(val)}
          collectionId={collectionId}
        />
      )} */}

      <CtrlDuo>
        <FDMenu
          className="z-30"
          entries={[
            {
              title: "Settings",
              prefix: <CogIcon className={c(iconSize)} />,
              onClick: () => {
                nav(`/collection/${collectionId}`);
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
              disabled: true || process.env.REACT_APP_ENABLE_API !== "true",
              onClick: () => nav(`/publishCollection/${collectionId}`),
            },
          ]}
        >
          <MenuIcon className="w-9 h-9 p-1.5 rounded-full bg-gray-400 hover:bg-gray-300" />
        </FDMenu>
        <TrashIcon
          onClick={async () => {
            configDispatch.deleteCollection({ collectionId });
          }}
          className="w-9 h-9 p-1.5 rounded-full bg-danger-600 hover:bg-danger-400"
        />
      </CtrlDuo>
    </div>
  );
};