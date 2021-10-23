import c from "clsx";
import React, { useState } from "react";

export const TabView: React.FC<{
  tabs: { title: string; prefix: JSX.Element; content: JSX.Element }[];
}> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <div className="flex h-full">
      <div className="h-auto rounded-bl-2xl w-56 bg-gray-800">
        {tabs.map((tab, index) => (
          <div
            className={c(
              "w-full inline-flex items-center font-normal text-lg tracking-wide  whitespace-nowrap  p-3  cursor-pointer select-none  rounded-r-sm",
              activeTabIndex === index
                ? "text-white bg-primary-600 shadow-xl "
                : "text-white hover:bg-gray-400"
            )}
            onClick={() => setActiveTabIndex(index)}
            key={index}
          >
            <span className="mr-2">{tab.prefix}</span>
            {tab.title}
          </div>
        ))}
      </div>
      <div className="flex justify-center w-full p-8 h-dp-settings">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={c(
              "w-full",
              activeTabIndex === index ? "flex" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
