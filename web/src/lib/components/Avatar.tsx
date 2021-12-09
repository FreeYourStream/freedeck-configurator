import React from "react";

import { Maybe } from "../../generated/types-and-hooks";

export const Avatar: React.FC<{ src: Maybe<string>; size?: number }> = ({
  src,
  size = 24,
}) => {
  if (src) {
    return (
      <div className="overflow-hidden rounded-full">
        <img src={src} alt="avatar" width={size} />
      </div>
    );
  } else {
    return <></>;
  }
};
