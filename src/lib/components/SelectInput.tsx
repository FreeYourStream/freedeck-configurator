import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import c from "clsx";
import React, { Fragment } from "react";
export interface SelectOption {
  value: any;
  text: string;
}
export const FDSelect: React.FC<{
  disabled?: boolean;
  className?: string;
  onChange: (value: any) => any;
  value: any;
  options: SelectOption[];
}> = ({ disabled, onChange, value, className, options }) => {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button
          className={c(
            "py-1 pl-3 pr-10 text-left bg-gray-400 rounded-md shadow-md",
            "cursor-default focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500",
            className
          )}
        >
          <span className="block truncate">
            {options.find((option) => option.value === value)?.text}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon
              className="w-5 h-5 text-gray-50"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform -translate-y-2 opacity-0"
          enterTo="transform -translate-y-0 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform -translate-y-0 opacity-100"
          leaveTo="transform -translate-y-2 opacity-0"
        >
          <Listbox.Options className="absolute mt-2 bg-gray-400 py-2 rounded-md select-none overflow-y-auto max-h-72 z-50 -trans">
            {options.map((option, index) => (
              <Listbox.Option className="" key={index} value={option.value}>
                {({ selected, active }) => (
                  <div
                    className={c(
                      "flex items-center w-full p-2 pl-10 relative mr-4",
                      !!active && "bg-gray-300",
                      !!selected && "bg-primary-600"
                    )}
                  >
                    {!!selected && (
                      <CheckIcon className="h-5 w-5 absolute top-3 left-3" />
                    )}
                    {option.text}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
  // return (
  //   <select
  //     defaultValue={defaultValue}
  //     className={c("form-select block p-1 bg-gray-400 rounded", className)}
  //     onChange={onChange}
  //     value={value}
  //   >
  //     {children}
  //   </select>
  // );
};
