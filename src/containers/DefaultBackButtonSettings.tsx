import React, { useContext } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";
import { DisplaySettingsContainer } from "./DisplaySettings";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { RefreshIcon } from "@heroicons/react/outline";
import { ConfigDispatchContext } from "../states/configState";

export const DefaultBackButtonSettings: React.FC<{}> = () => {
  const configDispatch = useContext(ConfigDispatchContext);
  const menuId = `defaultBackButtonSettings`;
  const menuRef = useContextMenuTrigger<HTMLDivElement>({ menuId }); //image loading

  return (
    <>
      <ContextMenu menuId={menuId}>
        <ContextMenuItem
          text="Reset to default"
          prefix={<RefreshIcon className="h-6 w-6" />}
          onClick={() => configDispatch.resetDefaultBackButton(undefined)}
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
