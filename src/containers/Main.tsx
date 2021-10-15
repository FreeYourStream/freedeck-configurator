import c from "clsx";
import React from "react";

export const Main: React.FC = (props) => {
  return (
    <div className={c("flex flex-col h-full w-full")}>{props.children}</div>
  );
};
