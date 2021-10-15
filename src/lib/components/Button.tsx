import c from "clsx";
import React from "react";
import styled from "styled-components";

import { colors } from "../../definitions/colors";
import { Icons } from "./Icons";

export const Spacer = styled.div<{ mr: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${(p) => p.mr}px;
`;

export interface IFDButtonProps {
  type?: "danger" | "normal" | "cta";
  children?: any;
  onClick?: (e: any) => void;
  size?: 1 | 2 | 3;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
}

export const FDButton = ({
  size = 2,
  type = "normal",
  onClick,
  children,
  prefix,
  suffix,
}: IFDButtonProps) => {
  const sizeClasses = c(
    size === 1 && "px-3 py-1 space-x-2",
    size === 2 && "px-5 py-2 space-x-2",
    size === 3 && "px-6 py-3 space-x-2"
  );

  const typeClasses = c(
    type === "danger" &&
      "bg-danger-3 shadow-lg text-white hover:bg-danger-4 hover:shadow-xl",
    type === "normal" &&
      "bg-gray-3 shadow-lg text-white hover:bg-gray-4 hover:shadow-xl",
    type === "cta" &&
      "bg-success-3 shadow-lg text-white hover:bg-success-4 hover:shadow-xl"
  );

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center text-lg font-semibold tracking-wide rounded-md select-none cursor-pointer ${sizeClasses} ${typeClasses}`}
    >
      {!!prefix && <span>{prefix}</span>}
      <span>{children}</span>
      {!!suffix && <span>{suffix}</span>}
    </button>
  );
};

export const Icon: React.FC<{ icon: string; size?: number; color?: string }> =
  ({ color, icon, size }) => {
    const iconClass = icon.split("/")[0];
    const iconName = icon.split("/")[1];
    const Icon =
      // @ts-ignore
      Icons[iconClass][iconName];
    return <Icon size={size ?? 22} color={color ?? colors.black} />;
  };

export const FDIconButton = (props: IFDButtonProps & { icon?: string }) => (
  <FDButton {...props}>
    {props.icon && Icon ? (
      <div
        className={c(
          props.children && (props.size ?? 2) === 1 && "mr-1",
          props.children && (props.size ?? 2) === 2 && "mr-2",
          props.children && (props.size ?? 2) === 3 && "mr-4"
        )}
      >
        <Icon
          size={16 + (props.size ?? 2) * 3}
          icon={props.icon}
          color="white"
        />
      </div>
    ) : (
      ""
    )}
    {props.children}
  </FDButton>
);

export const FDIconButtonFixed = (
  props: IFDButtonProps & { icon?: string }
) => {
  return (
    <div className="fixed bottom-5 right-6">
      <FDIconButton {...props} />
    </div>
  );
};
