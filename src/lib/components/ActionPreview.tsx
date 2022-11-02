import {
  ArrowRightCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import c from "clsx";
import React, { useContext } from "react";

import { EMediaKeys } from "../../definitions/keys";
import { EAction, FDSettings } from "../../definitions/modes";
import { ButtonSetting, Page } from "../../generated";
import { ConfigStateContext } from "../../states/configState";
import { useTranslateKeyboardLayout } from "../localisation/keyboard";
import { getPageName } from "../misc/util";
import { CtrlDuo } from "./CtrlDuo";

const Pill: React.FC<{
  className?: string;
  button: ButtonSetting;
  hideChangePage?: boolean;
}> = ({ className, button, hideChangePage: genericBackButton = false }) => {
  const configState = useContext(ConfigStateContext);
  const { pages } = configState;
  const keys = useTranslateKeyboardLayout(button.values[EAction.hotkeys]);
  const pillClassName =
    "flex px-2 justify-center items-center gap-1 align-middle text-base shadow-lg rounded-md overflow-hidden";
  return (
    <div className={c("flex justify-center whitespace-nowrap", className)}>
      {button.mode === EAction.changePage &&
        !genericBackButton &&
        !!button.values[EAction.changePage] && (
          <div className={c(pillClassName, "bg-gray-500")}>
            <ArrowRightCircleIcon className="w-4 h-4" />
            <span className="overflow-ellipsis overflow-hidden">
              {getPageName(
                button.values[EAction.changePage]!,
                pages.byId[button.values[EAction.changePage]!]
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
      {button.mode === EAction.text && !!button.values[EAction.text]?.length && (
        <div className={c(pillClassName, "bg-gray-500")}>
          <span className="min-w-0 overflow-ellipsis overflow-hidden">
            {button.values[EAction.text]}
          </span>
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
      {/* @ts-ignore*/}
      {button.mode !== EAction.noop && !button.values[button.mode] && (
        <div className={c(pillClassName, "bg-danger-500")}>
          <ExclamationCircleIcon className="w-4 h-4" />
          <span title="check the button settings for completeness">Error</span>
        </div>
      )}
    </div>
  );
};

export const ActionPreview: React.FC<{
  className?: string;
  page: Page;
  displayIndex: number;
  hideChangePage?: boolean;
}> = ({ page, displayIndex, children, className, hideChangePage = false }) => {
  const button = page.displayButtons[displayIndex].button;

  return (
    <div className={c("h-6 overflow-hidden w-32", className)}>
      <CtrlDuo>
        <Pill button={button.primary} hideChangePage={hideChangePage} />
        <Pill button={button.secondary} hideChangePage={hideChangePage} />
      </CtrlDuo>
    </div>
  );
};
