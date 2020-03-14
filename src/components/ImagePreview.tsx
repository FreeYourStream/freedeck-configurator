import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { copyToClipboard } from "../lib/copyToClipboard";
import { download } from "../lib/download";
import { convertFile } from "../lib/convertFile";
import { binaryConversion } from "../lib/bufferToHexString";

let fileReader: FileReader;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const ControlRow = styled.div`
  margin: 4px;
  color: white;
  display: flex;
  align-items: center;
`;

const ControlRowMax = styled.div`
  margin: 4px;
  color: white;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Label = styled.label`
  font-family: mono-space, sans-serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 3px;
`;

const FixedLabel = styled.div`
  width: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  color: black;
  background-color: white;
  border: none;
  width: 50px;
  height 30px;
  margin: 4px;
  border-radius: 3px;
`;

const CheckBox = styled.input`
  width: 18px;
  height: 18px;
`;

const PixelatedImage = styled.img`
  border: 1px solid white;
  image-rendering: pixelated;
  :hover {
    cursor: pointer;
  }
`;

const handleFileSelect = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    if (!file) return;
    fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result as ArrayBuffer;
      if (!content?.byteLength) return;
      resolve(content as ArrayBuffer);
    };
    fileReader.readAsArrayBuffer(file);
  });
};

export interface IProps {
  image: File;
  deleteFunction: () => void;
  width: number;
  height: number;
}

const ImagePreview: React.FC<IProps> = ({
  image,
  deleteFunction,
  width = 128,
  height = 64
}) => {
  const [hexVal, setHexVal] = useState<string>("");
  const [contrast, setContrast] = useState<number>(0);
  const [dither, setDither] = useState<boolean>(true);
  const [invert, setInvert] = useState<boolean>(false);
  const [b64Image, setB64Image] = useState<string>("");
  const [binary, setBinary] = useState<Buffer>();
  useEffect(() => {
    (async () => {
      const arrayBuffer = await handleFileSelect(image);
      const imageString = await convertFile(
        arrayBuffer,
        width,
        height,
        contrast,
        invert,
        dither
      );
      setB64Image(imageString.base64);
      setHexVal(imageString.hex);
      setBinary(imageString.binary);
    })();
  }, [contrast, dither, invert, image, height, width]);
  return (
    <Wrapper>
      <Button onClick={() => deleteFunction()}>Delete</Button>
      <PixelatedImage
        width={width}
        height={height}
        src={b64Image}
        onClick={() => (
          copyToClipboard(hexVal), binary && download(binaryConversion(binary))
        )}
        title="click to copy hex"
      />
      <ControlRow>
        <Button onClick={() => setContrast(Math.max(contrast - 0.1, -1))}>
          - -
        </Button>
        <Button onClick={() => setContrast(Math.max(contrast - 0.02, -1))}>
          -
        </Button>
        <FixedLabel>
          <Label>{contrast.toFixed(2)}</Label>
        </FixedLabel>
        <Button onClick={() => setContrast(Math.min(contrast + 0.02, 1))}>
          +
        </Button>
        <Button onClick={() => setContrast(Math.min(contrast + 0.1, 1))}>
          + +
        </Button>
      </ControlRow>
      <ControlRowMax>
        <Label htmlFor="invert">Invert</Label>
        <CheckBox
          id="invert"
          type="checkbox"
          onChange={() => setInvert(!invert)}
          checked={invert}
        />
      </ControlRowMax>
      <ControlRowMax>
        <Label htmlFor="dither">Dither</Label>
        <CheckBox
          id="dither"
          type="checkbox"
          onChange={() => setDither(!dither)}
          checked={dither}
        />
      </ControlRowMax>
    </Wrapper>
  );
};

export default React.memo(ImagePreview);
