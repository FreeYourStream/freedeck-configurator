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
        `rounded-full overflow-hidden appearance-none h-4 ${className}`,
        disabled ? "bg-primary-300" : "bg-primary-600"
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
