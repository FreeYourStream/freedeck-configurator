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
import { getPageName } from "../util";
import { CtrlDuo } from "./CtrlDuo";

const Pill: React.FC<{ className?: string; button: IButtonSetting }> = ({
  className,
  button,
}) => {
  const configState = useContext(ConfigStateContext);
  const { pages } = configState;
  const keys = useTranslateKeyboardLayout(
    button.mode === EAction.hotkeys
      ? button.values[EAction.hotkeys]
      : button.values[EAction.text]
  );
  const pillClassName =
    "flex px-2 justify-center items-center gap-1 align-middle h-6 text-base shadow-lg rounded-md overflow-hidden";
  return (
    <div className={c("flex justify-center whitespace-nowrap w-36", className)}>
      {button.mode === EAction.changePage &&
        !!button.values[EAction.changePage] && (
          <div className={c(pillClassName, "bg-gray-500")}>
            <ArrowCircleRightIcon className="w-4 h-4" />
            <span className="overflow-ellipsis overflow-hidden">
              {getPageName(
                button.values[EAction.changePage],
                pages.byId[button.values[EAction.changePage]]
              )}
            </span>
          </div>
        )}
      {button.mode === EAction.hotkeys &&
        !!button.values[EAction.hotkeys].length && (
          <div className={c(pillClassName, "bg-gray-500")}>
            <span>{keys.join("+")}</span>
          </div>
        )}
      {button.mode === EAction.text && !!button.values[EAction.text].length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.special_keys &&
        !!button.values[EAction.special_keys] && (
          <div className={c(pillClassName, "bg-gray-500")}>
            <span>
              {EMediaKeys[button.values[EAction.special_keys]].toString()}
            </span>
          </div>
        )}
      {button.mode === EAction.settings &&
        !!button.values[EAction.settings].setting && (
          <div className={c(pillClassName, "bg-gray-500")}>
            <span>{button.values[EAction.settings].value}</span>
            {button.values[EAction.settings].setting ===
              FDSettings.absolute_brightness &&
              button.values[EAction.settings].value !== undefined && (
                <span>
                  {(
                    (button.values[EAction.settings].value! / 255) *
                    100
                  ).toFixed(0)}
                </span>
              )}
          </div>
        )}
      {button.mode !== EAction.noop && !button.values[button.mode] && (
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
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex, children, className }) => {
  const config = useContext(ConfigStateContext);
  const button = config.pages.byId[pageId].displayButtons[displayIndex].button;
  return (
    <div className={c("absolute -bottom-4", className)}>
      <CtrlDuo>
        <Pill button={button.primary} />
        <Pill button={button.secondary} />
      </CtrlDuo>
    </div>
  );
};
