import c from "clsx";
import React from "react";

export const TitleBox: React.FC<{
  className?: string;
  title: string;
  center?: boolean;
}> = ({ className, children, title, center = false }) => {
  return (
    <div className={c("p-6 rounded-xl bg-gray-800", className)}>
      <div className={c("text-2xl", "mb-8", center && "flex justify-center")}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};
