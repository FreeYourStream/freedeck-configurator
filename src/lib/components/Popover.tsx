import React, { useEffect, useRef } from "react";
import c from "clsx";
export interface PopoverEntry {
  title: string;
  prefix: JSX.Element;
  onClick: () => any;
}
export const Popover: React.FC<{
  className?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => any;
  entries: PopoverEntry[];
}> = ({ entries, className, isOpen, setIsOpen, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", callback);
    return () => document.removeEventListener("mousedown", callback);
  }, [setIsOpen]);
  return (
    <div
      ref={ref}
      className="relative flex flex-col justify-center items-center z-30"
    >
      <div>{children}</div>
      {!!isOpen && (
        <div
          className={c(
            "absolute top-full flex flex-col justify-center items-center"
          )}
        >
          <div className="mt-1 arrow-up"></div>
          <div
            className={c(
              "py-4 bg-gray-600 rounded-xl flex flex-col justify-center items-center",
              className
            )}
          >
            {entries.map((entry, index) => (
              <div
                className={c(
                  "w-full inline-flex items-center font-normal text-lg tracking-wide  whitespace-nowrap py-3  px-7 cursor-pointer select-none  rounded-r-sm text-white hover:bg-gray-400"
                )}
                onClick={() => {
                  setIsOpen(false);
                  entry.onClick();
                }}
                key={index}
              >
                <span className="mr-4">{entry.prefix}</span>
                {entry.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
