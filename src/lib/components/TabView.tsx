import c from "clsx";
import React, { ReactNode, useState } from "react";

export const TabView: React.FC<{
  tabs: string[];
  renderTab: (tabName: string) => ReactNode;
}> = ({ tabs, renderTab }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div className="flex h-full">
      <div className="h-auto bg-gradient-to-r from-red-100 to-gray-400 rounded-bl-2xl">
        {tabs.map((tab, index) => (
          <div
            className={c(
              "text-2xl  whitespace-nowrap  p-2  cursor-pointer select-none w-64",
              activeTabIndex === index
                ? "text-white bg-gradient-to-r from-gray-900 to-gray-600 font-semibold"
                : "text-black hover:bg-danger-1 font-normal"
            )}
            onClick={() => setActiveTabIndex(index)}
            key={index}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full p-4 h-modal">
        {renderTab(tabs[activeTabIndex])}
      </div>
    </div>
  );
};
