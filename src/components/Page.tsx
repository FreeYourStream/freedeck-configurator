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
  deletePage: (pageIndex: number) => void;
  setImage: (newImage: Buffer, pageIndex: number, displayIndex: number) => void;
  setRow: (newRow: number[], pageIndex: number, displayIndex: number) => void;
  pageCount: number;
}

export const Page: React.FC<IProps> = ({
  pageIndex,
  width,
  height,
  images,
  page,
  setImage,
  setRow,
  deletePage,
  pageCount
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
      <button
        onClick={() => {
          const deleteConfirmed = window.confirm(
            "Do you really want to delete this page forever?"
          );
          if (deleteConfirmed) deletePage(pageIndex);
        }}
      >
        delete
      </button>
      <Grid height={height} width={width}>
        {rowBuffers.map((rowBuffer, imageIndex) => (
          <Display
            images={images}
            rowBuffer={rowBuffer}
            key={imageIndex}
            imageIndex={pageIndex * width * height + imageIndex}
            setRow={newRow => setRow(newRow, pageIndex, imageIndex)}
            setImage={newImage => setImage(newImage, pageIndex, imageIndex)}
            pages={[...Array(pageCount).keys()].filter(
              pageNumber => pageNumber != pageIndex
            )}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
