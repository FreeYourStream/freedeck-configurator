import Jimp from "jimp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useContextMenuTrigger } from "react-context-menu-wrapper";

import { IDefaultBackDisplay } from "../App";
import { getEmptyConvertedImage } from "../definitions/emptyConvertedImage";
import { getBase64Image } from "../lib/base64Encode";
import { FDButton } from "../lib/components/Button";
import { ContextMenu, ContextMenuItem } from "../lib/components/ContextMenu";
import { DisplaySettings } from "../lib/components/DisplaySettings";
import { DisplaySettingsContainer } from "../lib/components/DisplaySettingsContainer";
import { DropDisplay } from "../lib/components/DropDisplay";
import { composeImage } from "../lib/composeImage";
import { loadDefaultBackDisplay } from "../lib/defaultBackImage";
import { handleFileSelect } from "../lib/handleFileSelect";
import { fileToImage } from "../lib/originalImage";

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
