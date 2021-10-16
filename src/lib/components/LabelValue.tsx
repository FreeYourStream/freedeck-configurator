import React from "react";
import c from "clsx";

export const Label: React.FC = (props) => {
  return <div className={c("text-xl mr-4")}>{props.children}</div>;
};

export const Value: React.FC = (props) => {
  return <div className={c("text-xl font-bold")}>{props.children}</div>;
};
