import React from "react";
import c from "clsx";

export const Title: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return <div className={c("text-2xl", className)}>{children}</div>;
};
