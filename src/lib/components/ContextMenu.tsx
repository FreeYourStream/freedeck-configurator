import c from "clsx";
import React, { ReactNode, ReactNodeArray } from "react";
import { ContextMenuWrapper } from "react-context-menu-wrapper";
import { Label } from "./LabelValue";

export const ContextMenuItem: React.FC<{
  prefix?: JSX.Element;
  text: string;
  dangerous?: boolean;
  onClick: () => void;
}> = ({ dangerous, text, onClick, prefix }) => {
  return (
    <div
      className={c(
        "flex items-center content-start px-2 py-1 gap-2 cursor-pointer font-normal text-lg",
        dangerous ? "bg-danger-600 hover:bg-danger-500" : "bg-gray-600"
      )}
      onClick={() => onClick()}
    >
      {!!prefix && prefix}
      {text}
    </div>
  );
};

export const ContextMenu: React.FC<{
  children: ReactNode | ReactNodeArray;
  menuId: string;
}> = ({ children, menuId }) => {
  return (
    <ContextMenuWrapper id={menuId}>
      <div className="flex flex-col justify-center gap-1px bg-gray-900 rounded-md overflow-hidden">
        {children}
      </div>
    </ContextMenuWrapper>
  );
};
