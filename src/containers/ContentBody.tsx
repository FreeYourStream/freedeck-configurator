import c from "clsx";
import React from "react";

export const ContentBody: React.FC = (props) => {
  return (
    <div
      id="contentBody"
      className={c(
        "flex-col justify-center items-center w-full h-full overflow-y-auto"
      )}
    >
      {props.children}
    </div>
  );
};
