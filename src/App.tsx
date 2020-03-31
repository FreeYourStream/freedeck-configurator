import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Page } from "./components/Page";
import { handleFileSelect } from "./lib/fileSelect";
import { parseConfig } from "./lib/parse/parseConfig";
import { download } from "./lib/download";
import { HEADER_SIZE, ROW_SIZE } from "./constants";
import defaultRowBuffer from "./definitions/defaultRowBuffer";
import { Button } from "./components/lib/button";
import { File } from "./components/lib/file";

const Main = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const SideBar = styled.div`
  background-color: black;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Horiz = styled.div`
  display: flex;
  margin-top: 24px;
`;

const MainBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export interface IConfig {
  width: number;
  height: number;
  pages: number;
  images: Buffer[];
}

function App() {
  const [height, setHeight] = useState<number>(2);
  const [width, setWidth] = useState<number>(3);
  const [pageBuffers, setPageBuffers] = useState<Buffer[]>([]);
  const [imageBuffers, setImageBuffers] = useState<Buffer[]>([]);

  const setImage = (
    newImage: Buffer,
    pageIndex: number,
    displayIndex: number
  ) => {
    const newImages = [...imageBuffers];
    newImages[width * height * pageIndex + displayIndex] = newImage;
    setImageBuffers(newImages);
  };

  const setRow = (
    newRow: number[],
    pageIndex: number,
    displayIndex: number
  ) => {
    console.log("SETTING ROW", newRow, pageIndex, displayIndex);
    const newPageBuffers = [...pageBuffers];
    const newPage = newPageBuffers[pageIndex];
    newPage.set(newRow, displayIndex * ROW_SIZE);
    setPageBuffers(newPageBuffers);
  };

  const deletePage = (pageIndex: number) => {
    const pageSize = width * height;

    const newImages = [...imageBuffers];
    newImages.splice(pageSize * pageIndex, pageSize);
    setImageBuffers(newImages);

    const newPages = [...pageBuffers];
    newPages.forEach((newPage, index) => {
      if (index < pageIndex) {
        for (let i = 0; i < width * height; i++) {
          if (newPage.readUInt8(i * ROW_SIZE) === 1) {
            const oldValue = newPage.readUInt8(i * ROW_SIZE + 1);
            newPage.writeUInt8(i * ROW_SIZE + 1, oldValue - 1);
            console.log(
              oldValue,
              newPage.slice(i * ROW_SIZE, i * ROW_SIZE + 16)
            );
          }
        }
      }
    });
    newPages.splice(pageIndex, 1);
    //setPageCount(pageCount - 1);
    setPageBuffers(newPages);
  };

  const loadConfigFile = (configFile: File) =>
    handleFileSelect(configFile).then(arrayBuffer => {
      const config = parseConfig(Buffer.from(arrayBuffer));
      setHeight(config.height);
      setWidth(config.width);
      setPageBuffers(config.pages);
      //setPageCount(config.pageCount);
      setImageBuffers(config.images);
    });

  return (
    <Main>
      <SideBar>
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <Horiz>
            <p style={{ color: "white" }}>Load ConfigFile</p>
            <File
              onChange={async event => {
                if (event.target.files?.length) {
                  loadConfigFile(event.target.files[0]);
                }
              }}
            ></File>
          </Horiz>
        </form>
        <Horiz>
          <Button
            onClick={() => {
              setPageBuffers([...pageBuffers, defaultRowBuffer(width, height)]);
              const blankImages: Buffer[] = Array(width * height).fill(
                new Buffer(1024)
              );
              setImageBuffers([...imageBuffers, ...blankImages]);
            }}
          >
            Add Page
          </Button>
          <Button
            bgcolor="#00c3b0"
            onClick={() => {
              const header = new Buffer(HEADER_SIZE);
              header.writeUInt8(3, 0);
              header.writeUInt8(2, 1);
              const offset = pageBuffers.length * width * height + 1;
              header.writeUInt16LE(offset, 2);
              const newConfig = Buffer.concat([
                header,
                ...pageBuffers,
                ...imageBuffers
              ]);
              download(newConfig);
            }}
          >
            Save Config
          </Button>
        </Horiz>
      </SideBar>
      <MainBar>
        {pageBuffers?.map((page, index) => (
          <Page
            height={height}
            width={width}
            pageIndex={index}
            images={imageBuffers}
            page={page}
            key={index}
            setImage={setImage}
            setRow={setRow}
            deletePage={deletePage}
            pageCount={pageBuffers.length}
          />
        ))}
      </MainBar>
    </Main>
  );
}

export default App;
