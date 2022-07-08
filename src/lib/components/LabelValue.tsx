import React from "react";
import c from "clsx";

export const Label: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return <div className={c("text-xl mr-4", className)}>{children}</div>;
};

export const Value: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return <div className={c("text-xl font-bold", className)}>{children}</div>;
};
