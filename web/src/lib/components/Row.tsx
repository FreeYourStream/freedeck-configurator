import React from "react";
import c from "clsx";

export const Row: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={c("flex justify-between items-center my-2", className)}>
      {children}
    </div>
  );
};
