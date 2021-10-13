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
  htmlFor?: any;
  onClick?: (e: any) => void;
  size?: 1 | 2 | 3;
}

export const FDButton = (props: IFDButtonProps) => (
  <label htmlFor={props.htmlFor}>
    <div
      className={c(
        "rounded select-none",
        props.size === 1 && "px-3 py-0.5",
        (props.size === 2 || props.size === undefined) && "px-3 py-1",
        props.size === 3 && "px-6 py-2",
        props.type === "danger" && "bg-red-600 hover:bg-red-500",
        (props.type ?? "normal") === "normal" && "bg-gray-300 hover:bg-white",
        props.type === "cta" && "bg-green-600 hover:bg-green-500"
      )}
      onClick={props.onClick}
    >
      <div
        className={c(
          props.size === 1 && "text-lg",
          (props.size === 2 || props.size === undefined) && "text-xl",
          props.size === 3 && "text-2xl",
          (props.type ?? "normal") === "normal" ? "text-black" : "text-white",
          "flex items-center font-normal align text-center"
        )}
      >
        {props.children}
      </div>
    </div>
  </label>
);

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
          color={(props.type ?? "normal") === "normal" ? "black" : "white"}
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
