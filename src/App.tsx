import React, { useState } from "react";
import styled from "styled-components";
import ImagePreview from "./components/ImagePreview";

const Main = styled.div`
  background-color: black;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Label = styled.label`
  color: white;
  margin: 2px;
  font-family: monospace;
`;

function App() {
  const [images, setImages] = useState<File[]>([]);
  const [width, setWidth] = useState<number>(128);
  const [height, setHeight] = useState<number>(64);
  return (
    <Main>
      <form
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <input
          disabled={true}
          type="number"
          min="0"
          step="4"
          max="1024"
          value={width}
          onChange={e => setWidth(parseInt(e.target.value))}
        />
        <Label>x</Label>
        <input
          disabled={true}
          type="number"
          min="0"
          max="1024"
          value={height}
          onChange={e => setHeight(parseInt(e.target.value))}
        />
        <input
          type="file"
          onChange={async event => {
            if (event.target.files?.length) {
              setImages([...images, event.target.files[0]]);
            }
          }}
        ></input>
      </form>
      {images.map((image, index) => (
        <ImagePreview
          height={height}
          width={width}
          key={image.name + index}
          image={image}
          deleteFunction={() => (
            images.splice(index, 1), setImages([...images])
          )}
        ></ImagePreview>
      ))}
    </Main>
  );
}

export default App;
