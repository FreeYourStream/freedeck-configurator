import { CircleStackIcon, CogIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { iconSize } from "../../../definitions/iconSizes";
import { TabView } from "../../../lib/components/TabView";
import { FDWindow } from "../../../lib/components/Window";
import { getCollectionName } from "../../../lib/misc/util";
import { ConfigStateContext } from "../../../states/configState";
import { AutoPageSwitcherSettings } from "./AutoPageSwitcher";
import { CollectionGeneralSettings } from "./General";

export const CollectionSettingsModal: React.FC = () => {
  const params = useParams();
  const nav = useNavigate();
  const configState = useContext(ConfigStateContext);
  const { collectionId } = params;

  if (collectionId === undefined) return <></>;

  const collection = configState.collections.byId[collectionId];

  if (collection === undefined) return <></>;
  return (
    <FDWindow
      className="w-dp-settings"
      title={`Collection ${getCollectionName(collectionId, collection)}`}
      visible={true}
      setClose={() => nav("/")}
    >
      <TabView
        className="h-dp-settings"
        tabs={[
          {
            title: "General",
            content: <CollectionGeneralSettings collectionId={collectionId} />,
            prefix: <CogIcon className={iconSize} />,
          },
          {
            title: "Auto Page Switcher",
            content: <AutoPageSwitcherSettings collectionId={collectionId} />,
            prefix: <CircleStackIcon className={iconSize} />,
          },
        ]}
      />
    </FDWindow>
  );
};
