import c from "clsx";
import React from "react";

export const TextInput: React.FC<{
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
        "text-base appearance-none py-1 px-2 placeholder-gray-100 resize-none rounded-md",
        disabled ? "text-gray-50" : "text-white",
        disabled ? "bg-gray-200" : "bg-gray-500",
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
