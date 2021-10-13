import React from "react";
import c from "clsx";

export const Boilerplate: React.FC = (props) => {
  return <div className={c()}>{props.children}</div>;
};
