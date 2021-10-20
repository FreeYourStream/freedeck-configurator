import c from "clsx";
import React, { useContext } from "react";
import { ConfigStateContext } from "../../states/configState";

export const ImagePreview: React.FC<{
  $ref?: React.LegacyRef<HTMLImageElement>;
  pageIndex: number;
  displayIndex: number;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  big?: boolean;
}> = ({ $ref, className, onClick, big = false, pageIndex, displayIndex }) => {
  const configState = useContext(ConfigStateContext);
  const display =
    pageIndex === -1
      ? configState.defaultBackDisplay
      : configState.pages[pageIndex][displayIndex].display;
  return (
    <div>
      <img
        alt=""
        src={display.previewImage}
        ref={$ref}
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
