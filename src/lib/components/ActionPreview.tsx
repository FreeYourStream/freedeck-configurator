import React, { useContext } from "react";
import c from "clsx";
import { ConfigStateContext } from "../../states/configState";
import { EAction } from "../../definitions/modes";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { useTranslateKeyboardLayout } from "../localisation/keyboard";
import { CtrlDuo } from "./CtrlDuo";
import { IButtonSetting } from "../../interfaces";
import { EMediaKeys } from "../../definitions/keys";

const Pill: React.FC<{ className?: string; button: IButtonSetting }> = ({
  className,
  button,
}) => {
  const keys = useTranslateKeyboardLayout(button.values);
  return (
    <div className={c("w-full flex justify-center", className)}>
      {button.mode === EAction.changePage && !!button.values.length && (
        <div className="absolute top-14  rounded-full bg-gray-400 px-2 flex justify-center items-center gap-1 align-middle h-6 text-base">
          <ArrowCircleRightIcon className="w-4 h-4" />
          <span>{button.values[0] + 1}</span>
        </div>
      )}
      {button.mode === EAction.hotkeys && (
        <div className="absolute top-14 rounded-full bg-gray-400 px-2 flex justify-center items-center gap-1 align-middle h-6 text-base">
          <span>{keys.join("+")}</span>
        </div>
      )}
      {button.mode === EAction.special_keys && (
        <div className="absolute top-14 rounded-full bg-gray-400 px-2 flex justify-center items-center gap-1 align-middle h-6 text-base">
          <span>{EMediaKeys[button.values[0]].toString()}</span>
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
  const button = config.buttonSettingsPages[pageIndex][displayIndex];
  return (
    <div className={c("", className)}>
      <CtrlDuo>
        <Pill button={button.primary} />
        <Pill button={button.secondary} />
      </CtrlDuo>
    </div>
  );
};
