import c from "clsx";
import React from "react";

export interface IFDButtonProps {
  className?: string;
  disabled?: boolean;
  type?: "danger" | "normal" | "primary" | "success";
  children?: any;
  onClick?: (e: any) => void;
  size?: 1 | 2 | 3;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  title?: string;
}

export const FDButton = ({
  className,
  disabled = false,
  size = 2,
  type = "normal",
  onClick,
  children,
  prefix,
  suffix,
  title,
}: IFDButtonProps) => {
  const sizeClasses = c(
    size === 1 && "px-3 py-0 space-x-2",
    size === 2 && "px-4 py-1 space-x-2",
    size === 3 && "px-5 py-2 space-x-2"
  );

  const typeClasses = c(
    type === "danger" &&
      "bg-danger-500 shadow-lg text-white hover:bg-danger-400 hover:shadow-xl",
    type === "normal" &&
      (!disabled
        ? "bg-gray-400 shadow-lg text-white hover:bg-gray-300 hover:shadow-xl"
        : "text-gray-400 bg-gray-300"),
    type === "success" &&
      (!disabled
        ? "bg-success-600 shadow-lg text-white hover:bg-success-500 hover:shadow-xl"
        : "text-gray-200 bg-success-400"),
    type === "primary" &&
      (!disabled
        ? "bg-primary-600 shadow-lg text-white hover:bg-primary-500 hover:shadow-xl"
        : "text-gray-300 bg-primary-200"),
    disabled && "cursor-not-allowed"
  );

  return (
    <div
      onClick={onClick}
      title={title}
      className={`cursor-pointer inline-flex items-center text-lg font-normal tracking-wider rounded-md select-none min-w-0 ${sizeClasses} ${typeClasses} ${className}`}
    >
      {!!prefix && <span>{prefix}</span>}
      <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
        {children}
      </span>
      {!!suffix && <span>{suffix}</span>}
    </div>
  );
};
