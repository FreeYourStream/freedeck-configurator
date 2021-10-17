import React from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { DisplaySettingsContainer } from "./DisplaySettings";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";

export const DefaultBackButtonSettings: React.FC<{}> = () => {
  const menuId = `defaultBackButtonSettings`;
  const menuRef = useContextMenuTrigger<HTMLDivElement>({ menuId }); //image loading

  return (
    <>
      <ContextMenu menuId={menuId}>
        <ContextMenuItem
          text="Reset to default"
          icon="bi/BiReset"
          onClick={() => {
            console.log("LZLZLZ");
          }}
          dangerous
        ></ContextMenuItem>
      </ContextMenu>
      <DisplaySettingsContainer
        displayIndex={-1}
        pageIndex={-1}
        ref={menuRef}
      />
    </>
  );
};
