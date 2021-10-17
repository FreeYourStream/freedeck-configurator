import React from "react";
import { Maybe } from "../../generated/graphql";

export const Avatar: React.FC<{ src: Maybe<string>; size?: number }> = ({
  src,
  size = 24,
}) => {
  if (src) {
    return (
      <div className="w-4 h-4 overflow-hidden rounded-full">
        <img src={src} alt="avatar" width={size} />
      </div>
    );
  } else {
    return <></>;
  }
};
