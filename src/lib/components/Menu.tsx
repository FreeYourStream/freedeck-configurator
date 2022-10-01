import { Menu, Transition } from "@headlessui/react";
import c from "clsx";
import React, { Fragment } from "react";
export interface MenuEntry {
  title: string;
  prefix: JSX.Element;
  onClick: () => any;
  disabled?: boolean;
}
export const FDMenu: React.FC<{
  className?: string;
  // isOpen: boolean;
  // setIsOpen: (value: boolean) => any;
  entries: MenuEntry[];
}> = ({ entries, className, children }) => {
  return (
    <Menu>
      <div
        className={c(
          "flex justify-center",
          !className?.includes("absolute") && "relative",
          className
        )}
      >
        <Menu.Button className="overflow-hidden">{children}</Menu.Button>
        <div className="absolute top-full z-40">
          <Transition
            as={Fragment}
            enter="transition duration-75 ease-out"
            enterFrom="transform scale-95 -translate-y-2 opacity-0"
            enterTo="transform scale-100 -translate-y-0 opacity-100"
            leave="transition duration-50 ease-out"
            leaveFrom="transform scale-100 -translate-y-0  opacity-100"
            leaveTo="transform scale-95 -translate-y-2 opacity-0"
          >
            <Menu.Items>
              <div className="flex flex-col justify-center items-center">
                <div className="mt-1 arrow-up z-50" />
                <div className="bg-gray-500 rounded-lg gap-1px p-2 z-50 border-2 border-primary-500">
                  {entries.map((entry, index) => (
                    <Menu.Item key={index} disabled={!!entry.disabled}>
                      {({ active }) => (
                        <div
                          onClick={entry.onClick}
                          className={c(
                            "flex items-center px-4 py-2 rounded-lg whitespace-nowrap select-none",
                            active && "bg-gray-300"
                          )}
                        >
                          {!!entry.prefix && (
                            <span
                              className={c(
                                "mr-4",
                                entry.disabled && "text-gray-300"
                              )}
                            >
                              {entry.prefix}
                            </span>
                          )}
                          <span
                            className={c(entry.disabled && "text-gray-300")}
                          >
                            {entry.title}
                          </span>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </div>
      </div>
    </Menu>
  );
};
