import { Tab } from "@headlessui/react";
import c from "clsx";
import React, { Fragment } from "react";

export const TabView: React.FC<{
  className?: string;
  tabs: { title: string; prefix: JSX.Element; content: JSX.Element }[];
  onChange?: (currentIndex: number) => any;
  activeIndex?: number;
}> = ({ tabs, className, activeIndex = 0, onChange }) => {
  return (
    <Tab.Group
      vertical
      defaultIndex={activeIndex}
      key={activeIndex}
      onChange={(index) => onChange?.(index)}
    >
      <div className={c("flex", className)}>
        <Tab.List className="flex flex-col gap-1 bg-gray-800 p-2">
          {tabs.map((tab, index) => (
            <Tab key={index}>
              {({ selected }) => (
                <div
                  className={c(
                    "w-60 inline-flex items-center font-normal text-lg tracking-wide rounded-lg  whitespace-nowrap  p-3  cursor-pointer select-none ",
                    selected
                      ? "text-white bg-primary-600 shadow-xl "
                      : "text-white hover:bg-gray-400"
                  )}
                  // onClick={() => setActiveTabIndex(index)}
                >
                  <span className="mr-2">{tab.prefix}</span>
                  {tab.title}
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels as={Fragment}>
          {tabs.map((tab, index) => (
            <Tab.Panel key={index} className="w-full flex">
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
