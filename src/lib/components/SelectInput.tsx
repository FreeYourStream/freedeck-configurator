import React from "react";
import c from "clsx";

export const StyledSelect: React.FC<{
  defaultValue?: any;
  className?: string;
  title?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  value: any;
}> = ({ onChange, value, title, className, children, defaultValue }) => {
  return (
    <select
      defaultValue={defaultValue}
      className={c("form-select block p-1 bg-gray-400 rounded", className)}
      onChange={onChange}
      value={value}
    >
      {children}
    </select>
  );
};
