import c from "clsx";
import React from "react";

import { CtrlDuo } from "./CtrlDuo";
import { Value } from "./LabelValue";

export const FDSlider: React.FC<{
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
}> = ({
  children,
  className,
  onChange,
  value,
  min,
  max,
  step = 1,
  disabled = false,
}) => (
  <CtrlDuo>
    <input
      className={c(
        `rounded-md overflow-hidden appearance-none h-6 w-44 flex-shrink-0 p-1`,
        disabled ? "bg-primary-100" : "bg-primary-500",
        className
      )}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={onChange}
      title={
        disabled ? "This option only works with Text AND Image provided" : ""
      }
    />
    <Value>{value}</Value>
  </CtrlDuo>
);
