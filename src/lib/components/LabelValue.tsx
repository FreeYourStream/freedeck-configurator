import c from "clsx";
import React from "react";

export const Label: React.FC<{ className?: string; hint?: string }> = ({
  className,
  children,
  hint,
}) => {
  return (
    <div>
      <div className={c("text-xl mr-4", className)}>{children}</div>
      {hint && <div className="text-sm text-gray-300 ">{hint}</div>}
    </div>
  );
};

export const Value: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return <div className={c("text-xl font-bold", className)}>{children}</div>;
};
