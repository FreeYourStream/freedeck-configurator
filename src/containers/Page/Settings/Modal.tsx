import { CircleStackIcon, CogIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { iconSize } from "../../../definitions/iconSizes";
import { TabView } from "../../../lib/components/TabView";
import { FDWindow } from "../../../lib/components/Window";
import { getPageName } from "../../../lib/misc/util";
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
      title={`Page ${getPageName(pageId, page)}`}
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
            prefix: <CircleStackIcon className={iconSize} />,
          },
        ]}
      />
    </FDWindow>
  );
};
