import c from "clsx";
import React from "react";

export const Row: React.FC<{ className?: string; mode?: "top" | "middle" }> = ({
  children,
  className,
  mode = "middle",
}) => {
  return (
    <div
      className={c(
        "flex justify-between my-4",
        mode === "middle" ? "items-center" : "items-start",
        className
      )}
    >
      {children}
    </div>
  );
};
