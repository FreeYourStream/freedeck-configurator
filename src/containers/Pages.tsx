import React, { useContext } from "react";
import c from "clsx";
import { ConfigStateContext } from "../states/configState";
import { Page } from "./Page";

export const Pages: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configState = useContext(ConfigStateContext);
  return (
    <div
      className={c(
        "flex flex-wrap justify-evenly items-center w-full h-full overflow-y-auto pt-6 pb-16",
        className
      )}
    >
      {configState.pages.map((page, pageIndex) => (
        <Page pageIndex={pageIndex} key={pageIndex} />
      ))}
    </div>
  );
};
