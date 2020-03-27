import styled from "styled-components";
import React from "react";
import ImagePreview from "./ImagePreview";

const Grid = styled.div<{ width?: number; height?: number }>`
  display: grid;
  width: 400px;
  height: 400px;
  margin: 30px auto;
  grid-template-columns: ${p => {
    let fr = "1fr";
    for (var i = 0; i < (p.width ?? 2) - 1; i++) {
      fr += " 1fr";
    }
    return `${fr};`;
  }};
  grid-template-rows: ${p => {
    let fr = "1fr";
    for (var i = 0; i < (p.height ?? 2) - 1; i++) {
      fr += " 1fr";
    }
    return `${fr};`;
  }};
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const Dummy = styled.div`
  background-color: green;
`;

export const ConfigGrid: React.FC<{ width: number; height: number }> = ({
  width,
  height
}) => {
  let GridItems: React.ReactElement[] = [];

  for (var i = 0; i < width * height; i++) {
    GridItems.push(<Dummy />);
  }

  return (
    <Grid width={width} height={height}>
      {GridItems}
    </Grid>
  );
};
