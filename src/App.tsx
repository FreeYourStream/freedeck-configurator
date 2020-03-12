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

function App() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <Main>
      <form
        onSubmit={event => {
          event.preventDefault();
        }}
      >
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
