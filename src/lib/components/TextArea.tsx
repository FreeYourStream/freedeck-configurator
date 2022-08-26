import c from "clsx";
import React from "react";

export const TextArea: React.FC<{
  className?: string;
  onChange: (value: string) => any;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  onEnter?: () => any;
}> = ({
  className,
  children,
  onChange,
  value,
  placeholder,
  disabled,
  onEnter,
}) => {
  return (
    <textarea
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
    </textarea>
  );
};
