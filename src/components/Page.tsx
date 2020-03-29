import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { parsePage } from "../lib/parse/parsePage";
import { Display } from "./Display";

const Wrapper = styled.div`
  margin: 24px;
  background-color: #f0f;
`;

const Grid = styled.div<{ width: number; height: number }>`
  display: grid;
  margin: 30px auto;
  grid-template-columns: ${p => {
    let fr = "200px";
    for (var i = 0; i < p.width - 1; i++) {
      fr += " 200px";
    }
    return `${fr};`;
  }};
  grid-template-rows: ${p => {
    let fr = "200px";
    for (var i = 0; i < p.height - 1; i++) {
      fr += " 200px";
    }
    return `${fr};`;
  }};
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

interface IProps {
  pageIndex: number;
  width: number;
  height: number;
  page: Buffer;
  images: Buffer[];
  setImages: (newImages: Buffer[]) => void;
}

export const Page: React.FC<IProps> = ({
  pageIndex,
  width,
  height,
  images,
  page,
  setImages
}) => {
  const [rowBuffers, setRowBuffers] = useState<Buffer[]>([]);
  const imageCount = width * height;

  useEffect(() => {
    const rows = parsePage(page);
    setRowBuffers(rows);
  }, [page, imageCount, width, height]);

  return (
    <Wrapper>
      <p>{pageIndex}</p>
      <Grid height={height} width={width}>
        {rowBuffers.map((rowBuffer, index) => (
          <Display
            images={images}
            rowBuffer={rowBuffer}
            key={index}
            setImages={setImages}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
