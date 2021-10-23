import c from "clsx";
import React from "react";

export const Switch: React.FC<{
  className?: string;
  onChange: (value: boolean) => any;
  value: boolean;
}> = ({ className, value, onChange }) => {
  return (
    <div
      onClick={() => onChange(!value)}
      className={c(
        className,
        "flex w-12 h-6 rounded-full items-center p-1",
        value ? "bg-success-600" : "bg-danger-600"
      )}
    >
      <div
        className={c(
          "w-4 h-4 rounded-full bg-white transform transition ease-in-out duration-100",
          value ? "translate-x-6" : "translate-x-0"
        )}
      />
    </div>
  );
};
