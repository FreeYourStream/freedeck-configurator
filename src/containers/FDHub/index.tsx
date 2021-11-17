import { HomeIcon, SearchIcon } from "@heroicons/react/outline";
import React from "react";

import { iconSize } from "../../definitions/iconSizes";
import { TabView } from "../../lib/components/TabView";
import { Home } from "./Home";
import { FDSearch } from "./Search";

export const FDHub = () => {
  return (
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
  );
};
