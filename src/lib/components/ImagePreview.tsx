import c from "clsx";
import React from "react";

export const ImagePreview: React.FC<{
  $ref?: React.LegacyRef<HTMLImageElement>;
  clickable?: boolean;
  previewImage: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  size?: number;
}> = ({
  $ref,
  className,
  onClick,
  size = 2,
  previewImage,
  clickable = true,
}) => {
  return (
    <div>
      <img
        alt=""
        src={previewImage}
        ref={$ref}
        onClick={onClick}
        className={c(
          clickable && "cursor-pointer",

          size === 1 && "w-24 h-12",
          size === 2 && "w-32 h-16",
          size === 3 && "w-64 h-32",
          className
        )}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};
