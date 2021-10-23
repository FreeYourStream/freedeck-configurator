import React from "react";
import c from "clsx";

export const ContentBody: React.FC = (props) => {
  return (
    <div
      id="contentBody"
      className={c(
        "flex justify-center items-center w-full h-full overflow-y-auto"
      )}
    >
      {props.children}
    </div>
  );
};
