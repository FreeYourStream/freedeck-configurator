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
        "text-base appearance-none py-1 px-2 bg-gray-500 text-white placeholder-gray-100 resize-none rounded-md",
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
