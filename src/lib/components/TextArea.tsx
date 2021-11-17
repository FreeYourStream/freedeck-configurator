import c from "clsx";
import React from "react";

export const TextArea: React.FC<{
  className?: string;
  onChange: (value: string) => any;
  value: string;
  placeholder?: string;
}> = ({ className, children, onChange, value, placeholder }) => {
  return (
    <textarea
      placeholder={placeholder}
      className={c(
        "text-lg appearance-none py-1 px-2 bg-gray-500 text-white placeholder-gray-100 resize-none rounded-md",
        className
      )}
      onChange={(e) => {
        onChange(e.currentTarget.value);
      }}
      value={value}
    >
      {children}
    </textarea>
  );
};
