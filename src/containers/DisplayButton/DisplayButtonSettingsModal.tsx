import {
  AdjustmentsHorizontalIcon,
  PhotoIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TabView } from "../../lib/components/TabView";
import { FDWindow } from "../../lib/components/Window";
import { getPageName } from "../../lib/misc/util";
import { ConfigStateContext } from "../../states/configState";
import { ButtonSettingsContainer } from "./ButtonSettings";
import { DisplaySettingsContainer } from "./DisplaySettings";
import { LiveDataSettingsContainer } from "./LiveDataSettings";

export const DBSettingsModal: React.FC = () => {
  const params = useParams();
  const nav = useNavigate();
  const configState = useContext(ConfigStateContext);
  const { pageId } = params;

  if (pageId === undefined || params.displayIndex === undefined) return <></>;

  const displayIndex = parseInt(params.displayIndex);
  const page = configState.pages.byId[pageId];

  if (page === undefined) return <></>;
  return (
    <FDWindow
      className="w-dp-settings"
      title={`Page ${getPageName(pageId, page)} Display ${displayIndex + 1}`}
      visible={true}
      setClose={() => nav("/")}
    >
      <TabView
        className="h-dp-settings"
        tabs={[
          {
            title: "Display Settings",
            prefix: <PhotoIcon className="h-6 w-6" />,
            content: (
              <DisplaySettingsContainer
                pageId={pageId}
                displayIndex={displayIndex}
              />
            ),
          },
          {
            title: "Button Settings",
            prefix: <AdjustmentsHorizontalIcon className="h-6 w-6" />,
            content: (
              <ButtonSettingsContainer
                pageId={pageId}
                displayIndex={displayIndex}
              />
            ),
          },
          {
            title: "Live Data Settings",
            prefix: <PlayIcon className="h-6 w-6" />,
            content: (
              <LiveDataSettingsContainer
                pageId={pageId}
                displayIndex={displayIndex}
              />
            ),
          },
        ]}
      />
    </FDWindow>
  );
};
