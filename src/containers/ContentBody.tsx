import React from "react";
import c from "clsx";

export const ContentBody: React.FC = (props) => {
  return (
    <div
      id="page"
      className={c(
        "flex flex-wrap justify-around items-center w-full bg-gray-800"
      )}
    >
      {props.children}
    </div>
  );
};
