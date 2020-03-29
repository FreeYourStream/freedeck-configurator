import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Page } from "./components/Page";
import { handleFileSelect } from "./lib/fileSelect";
import { parseConfig } from "./lib/parse/parseConfig";
import { download } from "./lib/download";
import { HEADER_SIZE, ROW_SIZE } from "./constants";

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
  const [configFile, setConfigFile] = useState<File>();
  const [height, setHeight] = useState<number>(2);
  const [width, setWidth] = useState<number>(3);
  const [pagesBuffer, setPagesBuffer] = useState<Buffer[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [imageBuffers, setImageBuffers] = useState<Buffer[]>([]);

  useEffect(() => {
    if (configFile)
      handleFileSelect(configFile).then(arrayBuffer => {
        const config = parseConfig(Buffer.from(arrayBuffer));
        setImageBuffers(config.images);
        setHeight(config.height);
        setWidth(config.width);
        setPagesBuffer(config.pages);
        setPageCount(config.pageCount);
      });
  }, [configFile]);

  return (
    <Main>
      <SideBar>
        <form
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <input
            type="file"
            onChange={async event => {
              if (event.target.files?.length) {
                setConfigFile(event.target.files[0]);
              }
            }}
          ></input>
        </form>
        <button onClick={() => setPageCount(pageCount + 1)}>add page</button>
        <button
          onClick={() => {
            const header = new Buffer(HEADER_SIZE);
            header.writeUInt8(3, 0);
            header.writeUInt8(2, 1);
            const offset = pageCount * width * height + 1;
            header.writeUInt16BE(offset, 2);
            const newConfig = Buffer.concat([
              header,
              ...pagesBuffer,
              ...imageBuffers
            ]);
            download(newConfig);
          }}
        >
          save new config
        </button>
      </SideBar>
      <MainBar>
        {pagesBuffer?.map((page, index) => (
          <Page
            height={height}
            width={width}
            pageIndex={index}
            images={imageBuffers}
            page={page}
            key={index}
            setImages={setImageBuffers}
          />
        ))}
      </MainBar>
    </Main>
  );
}

export default App;
