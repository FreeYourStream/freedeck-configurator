import c from "clsx";
import React from "react";

export const TitleBox: React.FC<{
  className?: string;
  title: string;
  center?: boolean;
}> = ({ className, children, title, center = false }) => {
  return (
    <div
      className={c(
        "p-6 rounded-xl bg-gradient-to-b from-gray-700 via-gray-900 to-gray-900 shadow-2xl",
        className
      )}
    >
      <div className={c("text-2xl", "mb-8", center && "flex justify-center")}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};
