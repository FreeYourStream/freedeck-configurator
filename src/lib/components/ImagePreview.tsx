import c from "clsx";
import React, { useContext } from "react";
import { ConfigStateContext } from "../../states/configState";

export const ImagePreview: React.FC<{
  pageIndex: number;
  displayIndex: number;
  className?: string;
  ref?: React.LegacyRef<HTMLImageElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  big?: boolean;
}> = ({ ref, className, onClick, big = false, pageIndex, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.displaySettingsPages[pageIndex][displayIndex];
  return (
    <div>
      <img
        alt=""
        src={display.previewImage}
        ref={ref}
        onClick={onClick}
        className={c(
          "cursor-pointer",
          big ? "w-64 h-32" : "w-32 h-16",
          className
        )}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};
