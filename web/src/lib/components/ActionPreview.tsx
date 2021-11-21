import React, { useContext } from "react";
import c from "clsx";
import { ConfigStateContext } from "../../states/configState";
import { EAction } from "../../definitions/modes";
import {
  ArrowCircleRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { useTranslateKeyboardLayout } from "../localisation/keyboard";
import { CtrlDuo } from "./CtrlDuo";
import { IButtonSetting } from "../../interfaces";
import { EMediaKeys } from "../../definitions/keys";
import { FDSettings } from "../../definitions/fdsettings";

const Pill: React.FC<{ className?: string; button: IButtonSetting }> = ({
  className,
  button,
}) => {
  const keys = useTranslateKeyboardLayout(button.values);
  const pillClassName =
    "absolute top-14  px-2 flex justify-center items-center gap-1 align-middle h-6 text-base shadow-lg rounded-md";
  return (
    <div
      className={c("w-full flex justify-center whitespace-nowrap", className)}
    >
      {button.mode === EAction.changePage && !!button.values.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <ArrowCircleRightIcon className="w-4 h-4" />
          <span>{button.values[0] + 1}</span>
        </div>
      )}
      {button.mode === EAction.hotkeys && !!button.values.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.text && !!button.values.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.special_keys && !!button.values.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{EMediaKeys[button.values[0]].toString()}</span>
        </div>
      )}
      {button.mode === EAction.settings && !!button.values.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{FDSettings[button.values[0]]}</span>
          {button.values[0] === FDSettings["Brightness"] &&
            button.values[1] !== undefined && (
              <span>{((button.values[1] / 255) * 100).toFixed(0)}</span>
            )}
        </div>
      )}
      {button.mode !== EAction.noop && !button.values.length && (
        <div className={c(pillClassName, "bg-danger-500")}>
          <ExclamationCircleIcon className="w-4 h-4" />
          <span>Error</span>
        </div>
      )}
    </div>
  );
};

export const ActionPreview: React.FC<{
  className?: string;
  pageIndex: number;
  displayIndex: number;
}> = ({ pageIndex, displayIndex, children, className }) => {
  const config = useContext(ConfigStateContext);
  const button = config.pages[pageIndex][displayIndex].button;
  return (
    <div className={c("", className)}>
      <CtrlDuo>
        <Pill button={button.primary} />
        <Pill button={button.secondary} />
      </CtrlDuo>
    </div>
  );
};
