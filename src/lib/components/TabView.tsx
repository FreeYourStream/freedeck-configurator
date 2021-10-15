import c from "clsx";
import React, { ReactNode, useState } from "react";

export const TabView: React.FC<{
  tabs: { title: string; prefix: JSX.Element; content: JSX.Element }[];
}> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div className="flex h-full">
      <div className="h-auto rounded-bl-2xl">
        {tabs.map((tab, index) => (
          <div
            className={c(
              "inline-flex items-center font-normal text-lg tracking-wide  whitespace-nowrap  p-3  cursor-pointer select-none w-56  rounded-r-sm",
              activeTabIndex === index
                ? "text-gray-6 bg-primary-4 shadow-xl "
                : "text-white hover:bg-gray-3"
            )}
            onClick={() => setActiveTabIndex(index)}
            key={index}
          >
            <span className="mr-2">{tab.prefix}</span>
            {tab.title}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full p-4 h-modal">
        {tabs.map((tab, index) => (
          <div className={c(activeTabIndex === index ? "flex" : "hidden")}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
