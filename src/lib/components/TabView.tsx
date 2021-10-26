import { Tab } from "@headlessui/react";
import c from "clsx";
import React, { Fragment } from "react";

export const TabView: React.FC<{
  className?: string;
  tabs: { title: string; prefix: JSX.Element; content: JSX.Element }[];
}> = ({ tabs, className }) => {
  return (
    <Tab.Group vertical defaultIndex={0}>
      <div className={c("flex", className)}>
        <Tab.List className="flex flex-col gap-1 bg-gray-800 p-2">
          {tabs.map((tab, index) => (
            <Tab key={index}>
              {({ selected }) => (
                <div
                  className={c(
                    "w-full inline-flex items-center font-normal text-lg tracking-wide rounded-lg  whitespace-nowrap  p-3  cursor-pointer select-none ",
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
            <Tab.Panel key={index} className="w-full  p-4">
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  // return (
  //   <div className="flex h-full">
  //     <div className="flex flex-col gap-1 bg-gray-800 p-2">
  //       {tabs.map((tab, index) => (
  // <div
  //   className={c(
  //     "w-full inline-flex items-center font-normal text-lg tracking-wide rounded-lg  whitespace-nowrap  p-3  cursor-pointer select-none ",
  //     activeTabIndex === index
  //       ? "text-white bg-primary-600 shadow-xl "
  //       : "text-white hover:bg-gray-400"
  //   )}
  //   onClick={() => setActiveTabIndex(index)}
  //   key={index}
  // >
  //   <span className="mr-2">{tab.prefix}</span>
  //   {tab.title}
  // </div>
  //       ))}
  //     </div>
  //     <div className="flex justify-center w-full p-8 h-dp-settings">
  //       {tabs.map((tab, index) => (
  //         <div
  //           key={index}
  //           className={c(
  //             "w-full",
  //             activeTabIndex === index ? "flex" : "hidden"
  //           )}
  //         >
  //           {tab.content}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};
