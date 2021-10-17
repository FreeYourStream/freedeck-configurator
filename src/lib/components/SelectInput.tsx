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
    <label className={c("block text-left", className)}>
      {!!title && <span className="text-gray-700">Select</span>}
      <select
        defaultValue={defaultValue}
        className="form-select block w-full mt-1 p-1 bg-gray-400 rounded"
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </label>
  );
};
