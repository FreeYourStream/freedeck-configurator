import {
  ArrowCircleRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import c from "clsx";
import React, { useContext } from "react";

import { EMediaKeys } from "../../definitions/keys";
import { EAction } from "../../definitions/modes";
import { FDSettings, IButtonSetting } from "../../interfaces";
import { ConfigStateContext } from "../../states/configState";
import { useTranslateKeyboardLayout } from "../localisation/keyboard";
import { CtrlDuo } from "./CtrlDuo";

const Pill: React.FC<{ className?: string; button: IButtonSetting }> = ({
  className,
  button,
}) => {
  const keys = useTranslateKeyboardLayout(button.values.hotkeys);
  const pillClassName =
    "absolute top-14  px-2 flex justify-center items-center gap-1 align-middle h-6 text-base shadow-lg rounded-md";
  return (
    <div
      className={c("w-full flex justify-center whitespace-nowrap", className)}
    >
      {/* {button.mode === EAction.changePage && !!button.values.changePage && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <ArrowCircleRightIcon className="w-4 h-4" />
          <span>{button.values[0] + 1}</span>
        </div>
      )} */}
      {button.mode === EAction.hotkeys && !!button.values.hotkeys.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.text && !!button.values.text.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.special_keys && !!button.values.special_keys && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{EMediaKeys[button.values.special_keys].toString()}</span>
        </div>
      )}
      {button.mode === EAction.settings && !!button.values.settings.setting && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{button.values.settings.value}</span>
          {button.values.settings.setting === FDSettings.absolute_brightness &&
            button.values.settings.value !== undefined && (
              <span>
                {((button.values.settings.value / 255) * 100).toFixed(0)}
              </span>
            )}
        </div>
      )}
      {/* {button.mode !== EAction.noop && !button.values[button.mode] && (
        <div className={c(pillClassName, "bg-danger-500")}>
          <ExclamationCircleIcon className="w-4 h-4" />
          <span>Error</span>
        </div>
      )} */}
    </div>
  );
};

export const ActionPreview: React.FC<{
  className?: string;
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex, children, className }) => {
  const config = useContext(ConfigStateContext);
  const button = config.pages.byId[pageId].displayButtons[displayIndex].button;
  return (
    <div className={c("", className)}>
      <CtrlDuo>
        <Pill button={button.primary} />
        <Pill button={button.secondary} />
      </CtrlDuo>
    </div>
  );
};
