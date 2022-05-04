import c from "clsx";
import React from "react";

export const TitleInput: React.FC<{
  className?: string;
  disabled?: boolean;
  onChange: (value: string) => any;
  onEnter?: () => any;
  value?: string;
  placeholder?: string;
}> = ({
  className,
  children,
  onChange,
  onEnter,
  value,
  placeholder,
  disabled,
}) => {
  return (
    <input
      type="text"
      disabled={disabled}
      placeholder={placeholder}
      className={c(
        "text-xl appearance-none py-1 px-2 placeholder-gray-100 resize-none rounded-md",
        "bg-gray-50 bg-opacity-0 focus:bg-gray-700 focus:bg-opacity-100",
        disabled ? "text-gray-50" : "text-white",
        className
      )}
      onChange={(e) => {
        onChange(e.currentTarget.value);
      }}
      onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
      value={value}
    >
      {children}
    </input>
  );
};
