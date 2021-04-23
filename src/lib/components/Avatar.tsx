import React from "react";
import styled from "styled-components";
import { Maybe } from "../../generated/graphql";
const CircleCut = styled.div<{ size: number }>`
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  overflow: hidden;
  border-radius: 50%;
`;
export const Avatar: React.FC<{ src: Maybe<string>; size?: number }> = ({
  src,
  size = 24,
}) => {
  if (src) {
    return (
      <CircleCut size={size}>
        <img src={src} alt="avatar" width={size} />
      </CircleCut>
    );
  } else {
    return <></>;
  }
};
