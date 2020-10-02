import React, { useEffect } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";

import { IDefaultBackDisplay } from "../App";
import { loadDefaultBackDisplay } from "../definitions/defaultBackImage";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";

export const DefaultBackButtonSettings: React.FC<{
  setDefaultBackDisplay: React.Dispatch<
    React.SetStateAction<IDefaultBackDisplay>
  >;
  defaultBackDisplay: IDefaultBackDisplay;
}> = ({ setDefaultBackDisplay, defaultBackDisplay }) => {
  const menuId = `defaultBackButtonSettings`;
  const menuRef = useContextMenuTrigger<HTMLDivElement>({ menuId }); //image loading

  // the localStorage stuff should NOT happen here?
  useEffect(() => {
    setTimeout(() =>
      localStorage.setItem(
        "defaultBackImageSettings",
        JSON.stringify(defaultBackDisplay.settings)
      )
    );
    setTimeout(() =>
      localStorage.setItem(
        "defaultBackImage",
        JSON.stringify(defaultBackDisplay.image)
      )
    );
  }, [defaultBackDisplay.image, defaultBackDisplay.settings]);

  return (
    <>
      <ContextMenu menuId={menuId}>
        <ContextMenuItem
          text="Reset to default"
          icon="bi/BiReset"
          onClick={() => {
            loadDefaultBackDisplay(setDefaultBackDisplay, true);
          }}
          dangerous
        ></ContextMenuItem>
      </ContextMenu>
      <DisplaySettingsContainer
        display={defaultBackDisplay.settings}
        setOriginalImage={(image) =>
          setDefaultBackDisplay({ ...defaultBackDisplay, image })
        }
        originalImage={defaultBackDisplay.image}
        setImageSettings={(imageSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              imageSettings,
            },
          })
        }
        setTextSettings={(textSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              textSettings,
            },
          })
        }
        setTextWithIconSettings={(textWithIconSettings) =>
          setDefaultBackDisplay({
            ...defaultBackDisplay,
            settings: {
              ...defaultBackDisplay.settings,
              textWithIconSettings,
            },
          })
        }
        ref={menuRef}
      />
    </>
  );
};
