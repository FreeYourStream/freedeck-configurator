import React from "react";
import c from "clsx";

export const Switch: React.FC<{
  className?: string;
  onChange: (value: boolean) => any;
  value: boolean;
}> = ({ className, value, onChange }) => {
  return (
    <div
      onClick={() => (console.log("CLICK"), onChange(!value))}
      className={c(
        className,
        "flex w-12 h-6 rounded-full items-center p-1",
        value ? "bg-success-600" : "bg-danger-600"
      )}
    >
      <div className={c("w-4 h-4 rounded-full bg-white", value && "ml-auto")} />
    </div>
  );
};