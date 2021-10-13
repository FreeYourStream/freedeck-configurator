import React from "react";
import c from "clsx";

export const Main: React.FC = (props) => {
  return (
    <div className={c("flex flex-col h-full w-full bg-gray-800")}>
      {props.children}
    </div>
  );
};
