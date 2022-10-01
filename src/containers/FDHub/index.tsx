import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Route, Routes, useNavigate } from "react-router";

import { iconSize } from "../../definitions/iconSizes";
import { TabView } from "../../lib/components/TabView";
import { FDWindow } from "../../lib/components/Window";
import { Home } from "./Home";
import { HubPageDetails } from "./PageDetails";
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
            prefix: <MagnifyingGlassIcon className={iconSize} />,
            content: <FDSearch />,
          },
        ]}
      />
      <Routes>
        <Route path="page/:pageId" element={<HubPageDetails />} />
      </Routes>
    </FDWindow>
  );
};
