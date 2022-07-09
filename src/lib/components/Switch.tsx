import c from "clsx";
import React from "react";

export const FDSwitch: React.FC<{
  disabled?: boolean;
  className?: string;
  onChange: (value: boolean) => any;
  value: boolean;
}> = ({ className, value, onChange, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onChange(!value)}
      className={c(
        className,
        "flex w-12 h-6 rounded-md items-center p-1",
        !disabled
          ? value
            ? "bg-success-600"
            : "bg-danger-600"
          : value
          ? "bg-success-300"
          : "bg-danger-300"
      )}
    >
      <div
        className={c(
          "w-4 h-4 rounded bg-white transform transition ease-in-out duration-100",
          value ? "translate-x-6" : "translate-x-0"
        )}
      />
    </div>
  );
};
