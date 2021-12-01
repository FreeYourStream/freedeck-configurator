import { HomeIcon, SearchIcon } from "@heroicons/react/outline";
import React from "react";
import { useNavigate } from "react-router";

import { iconSize } from "../../definitions/iconSizes";
import { TabView } from "../../lib/components/TabView";
import { FDWindow } from "../../lib/components/Window";
import { Home } from "./Home";
import { FDSearch } from "./Search";

export const FDHub = () => {
  const nav = useNavigate();
  return (
    <FDWindow
      className="h-full w-full"
      title="FreeDeck Hub"
      visible={true}
      setClose={() => nav("/")}
    >
      <TabView
        className="h-full"
        tabs={[
          {
            title: "Home",
            prefix: <HomeIcon className={iconSize} />,
            content: <Home />,
          },
          {
            title: "Search",
            prefix: <SearchIcon className={iconSize} />,
            content: <FDSearch />,
          },
        ]}
      />
    </FDWindow>
  );
};
