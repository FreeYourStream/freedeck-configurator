import c from "clsx";
import React from "react";

export const ImagePreview: React.FC<{
  src: string;
  className?: string;
  ref?: React.LegacyRef<HTMLImageElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  big?: boolean;
}> = ({ ref, className, children, onClick, src, big = false }) => {
  return (
    <img
      alt=""
      src={src}
      ref={ref}
      onClick={onClick}
      className={c(
        "cursor-pointer",
        big ? "w-64 h-32" : "w-32 h-16",
        className
      )}
      style={{ imageRendering: "pixelated" }}
    >
      {children}
    </img>
  );
};
