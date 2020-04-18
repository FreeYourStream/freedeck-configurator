import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { parsePage } from "../lib/parse/parsePage";
import { Display } from "./Display";

const Wrapper = styled.div`
  position: relative;  
  margin: 24px;
  padding: 18px;
  /* border: 1px solid ${colors.white}; */
  border-radius: 21px;
  background: ${colors.gray};
  box-shadow:  13px 13px 21px #11161d, 
             -13px -13px 21px #2d3a49;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PageIndicator = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 50%;
  border: 1px solid #555;
  text-align: center;
  vertical-align: middle;
  line-height: 38px;
  width: 40px;
  height: 40px;
  color: ${colors.white};
  position: absolute;
  top: -20px;
  left: -20px;
  background-color: ${colors.black};
`;

const DeletePage = styled.img`
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  height: 22px;
  width: 22px;
  top: -8px;
  right: -8px;
  position: absolute;
  border-style: none;
`;

const Grid = styled.div<{ width: number; height: number }>`
  display: grid;
  grid-template-columns: ${(p) => {
    let fr = "128px";
    for (var i = 0; i < p.width - 1; i++) {
      fr += " 128px";
    }
    return `${fr};`;
  }};
  grid-template-rows: ${(p) => {
    let fr = "64px";
    for (var i = 0; i < p.height - 1; i++) {
      fr += " 64px";
    }
    return `${fr};`;
  }};
  margin: 20px;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

interface IProps {
  pageIndex: number;
  width: number;
  height: number;
  page: Buffer;
  images: Buffer[];
  deletePage: (pageIndex: number) => void;
  addPage: () => number;
  setImage: (newImage: Buffer, pageIndex: number, displayIndex: number) => void;
  setRow: (newRow: Buffer, pageIndex: number, displayIndex: number) => void;
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
  addPage,
  pageCount,
}) => {
  const [rowBuffers, setRowBuffers] = useState<Buffer[]>([]);
  const imageCount = width * height;
  useEffect(() => {
    const rows = parsePage(page);
    setRowBuffers(rows);
  }, [JSON.stringify(page), imageCount, width, height]);
  return (
    <Wrapper id={`page_${pageIndex}`}>
      <Header>
        <PageIndicator>{pageIndex}</PageIndicator>
        <DeletePage
          src="close.png"
          onClick={() => {
            const deleteConfirmed = window.confirm(
              "Do you really want to delete this page forever?"
            );
            if (deleteConfirmed) deletePage(pageIndex);
          }}
        />
      </Header>
      <Grid height={height} width={width}>
        {rowBuffers.map((rowBuffer, imageIndex) => (
          <Display
            images={images}
            rowBuffer={rowBuffer}
            key={imageIndex}
            imageIndex={pageIndex * width * height + imageIndex}
            setRow={(newRow) => setRow(newRow, pageIndex, imageIndex)}
            setImage={(newImage) => setImage(newImage, pageIndex, imageIndex)}
            pages={[...Array(pageCount).keys()].filter(
              (pageNumber) => pageNumber != pageIndex
            )}
            addPage={addPage}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
