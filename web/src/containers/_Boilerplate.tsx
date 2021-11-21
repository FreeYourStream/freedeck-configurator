import React from "react";
import c from "clsx";

export const Boilerplate: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return <div className={c(className)}>{children}</div>;
};
