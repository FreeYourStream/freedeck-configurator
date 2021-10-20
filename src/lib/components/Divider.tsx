import React from "react";
import c from "clsx";

export const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={c(className, "h-8 w-full")} />;
};
