import { CogIcon, CollectionIcon } from "@heroicons/react/outline";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { iconSize } from "../../../definitions/iconSizes";
import { TabView } from "../../../lib/components/TabView";
import { FDWindow } from "../../../lib/components/Window";
import { ConfigStateContext } from "../../../states/configState";
import { AutoPageSwitcherSettings } from "./AutoPageSwitcher";
import { PageGeneralSettings } from "./General";

export const PageSettingsModal: React.FC = () => {
  const params = useParams();
  const nav = useNavigate();
  const configState = useContext(ConfigStateContext);
  const { pageId } = params;

  if (pageId === undefined) return <></>;

  const page = configState.pages.byId[pageId];

  if (page === undefined) return <></>;
  return (
    <FDWindow
      className="w-dp-settings"
      title={`Page ${page.name.length ? page.name : pageId.slice(-4)}`}
      visible={true}
      setClose={() => nav("/")}
    >
      <TabView
        className="h-dp-settings"
        tabs={[
          {
            title: "General",
            content: <PageGeneralSettings pageId={pageId} />,
            prefix: <CogIcon className={iconSize} />,
          },
          {
            title: "Auto Page Switcher",
            content: <AutoPageSwitcherSettings pageId={pageId} />,
            prefix: <CollectionIcon className={iconSize} />,
          },
        ]}
      />
    </FDWindow>
  );
};
