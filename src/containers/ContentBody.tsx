import React from "react";
import c from "clsx";

export const ContentBody: React.FC = (props) => {
  return (
    <div
      id="page"
      className={c("flex flex-wrap justify-around items-center w-full")}
    >
      {props.children}
    </div>
  );
};
