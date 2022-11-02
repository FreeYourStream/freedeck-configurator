import {
  Bars3Icon,
  CogIcon,
  PlayIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import c from "clsx";
import React, { useContext } from "react";
import { useNavigate } from "react-router";

import { iconSize } from "../../definitions/iconSizes";
import { useMeQuery } from "../../generated/types-and-hooks";
import { CtrlDuo } from "../../lib/components/CtrlDuo";
import { FDMenu } from "../../lib/components/Menu";
import { AppDispatchContext } from "../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";

export const PageMenu: React.FC<{ pageId: string }> = ({ pageId }) => {
  const nav = useNavigate();
  const appDispatch = useContext(AppDispatchContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const configState = useContext(ConfigStateContext);
  const { data } = useMeQuery();
  return (
    <div className="flex items-center justify-center w-9 h-9  cursor-pointer shadow-lg">
      <CtrlDuo>
        <FDMenu
          className="z-20"
          entries={[
            {
              title: "Settings",
              prefix: <CogIcon className={c(iconSize)} />,
              onClick: () => nav(`/page/${pageId}`),
            },
            {
              title: "Delete",
              prefix: <TrashIcon className={c(iconSize, "text-danger-400")} />,
              onClick: () =>
                appDispatch.openConfirm({
                  title: "Delete this page?",
                  text: "Do you want to delete this page? It will be gone forever",
                  onAccept: () => configDispatch.deletePage(pageId),
                }),
            },
            {
              title: "Make start page",
              prefix: <PlayIcon className={c(iconSize)} />,
              onClick: () => configDispatch.setStartPage({ pageId }),
            },
            {
              title: configState.pages.byId[pageId].publishData
                ? configState.pages.byId[pageId].publishData?.createdBy ===
                  data?.user.id
                  ? "Update"
                  : "Fork"
                : "Publish",
              prefix: <ShareIcon className={iconSize} />,
              disabled: process.env.REACT_APP_ENABLE_API !== "true" || !data,
              onClick: () => nav(`/publishpage/${pageId}`),
            },
          ]}
        >
          <Bars3Icon className="w-9 h-9 p-1.5 rounded-full bg-gray-400 hover:bg-gray-300" />
        </FDMenu>
        <TrashIcon
          onClick={async () => {
            configDispatch.deletePage(pageId);
          }}
          className="w-9 h-9 p-1.5 rounded-full bg-danger-600 hover:bg-danger-400"
        />
      </CtrlDuo>
    </div>
  );
};
