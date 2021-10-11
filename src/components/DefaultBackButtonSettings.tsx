import React, { useEffect } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";

export const DefaultBackButtonSettings: React.FC<{}> = ({}) => {
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
