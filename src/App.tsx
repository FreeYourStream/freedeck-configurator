import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PNG } from "pngjs";
import fs from "floyd-steinberg";
import Jimp from "jimp";
import { bmp } from "./headers";

let fileReader: FileReader;

const Main = styled.div`
  background-color: black;
  height: 100%;
  width: 100%;
`;

const ImagePreview = styled.div`
  color: white;
`;

const PixelatedImage = styled.img`
  image-rendering: pixelated;
`;

function encode(input: Uint8Array) {
  var keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output +=
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
  }
  return output;
}

const bitConversion = (data: Buffer, canvasWidth: number) => {
  var output_string = "";
  var output_index = 0;

  var byteIndex = 7;
  var number = 0;

  // format is RGBA, so move 4 steps per pixel
  for (var index = 0; index < data.length; index += 4) {
    // Get the average of the RGB (we ignore A)
    var avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
    if (avg > 128) {
      number += Math.pow(2, byteIndex);
    }
    byteIndex--;
    // if this was the last pixel of a row or the last pixel of the
    // image, fill up the rest of our byte with zeros so it always contains 8 bits
    if (
      (index != 0 && (index / 4 + 1) % canvasWidth == 0) ||
      index == data.length - 4
    ) {
      for (var i = byteIndex; i > -1; i--) {
        number += Math.pow(2, i);
      }
      byteIndex = -1;
    }

    // When we have the complete 8 bits, combine them into a hex value
    if (byteIndex < 0) {
      var byteSet = number.toString(16);
      if (byteSet.length == 1) {
        byteSet = "0" + byteSet;
      }
      var hex = "0x" + byteSet;
      output_string += hex + ", ";
      output_index++;
      if (output_index >= 16) {
        output_string += "\n";
        output_index = 0;
      }
      number = 0;
      byteIndex = 7;
    }
  }
  return output_string;
};

const gettoConversion = (image: Jimp) => {
  const newArrayRGBA: number[] = [...bmp];
  const newArrayRGB: number[] = [...bmp];
  for (var i = 0; i < 64; i++) {
    for (var j = 0; j < 128; j++) {
      const values = Jimp.intToRGBA(image.getPixelColor(j, i));
      const bw = (values.r + values.g + values.b) / 3 > 128 ? 255 : 0;
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGBA.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
      newArrayRGB.push(bw);
    }
  }
  return { rgba: Buffer.from(newArrayRGBA), rgb: Buffer.from(newArrayRGB) };
};

const handleFileRead = (
  imageArrayBuffer: ArrayBuffer,
  index: number,
  contrast: number,
  invert: boolean,
  dither: boolean
): Promise<string> => {
  return new Promise(async resolve => {
    const pngImage = new PNG();
    const jimpImage = await Jimp.read(Buffer.from(imageArrayBuffer));
    if (invert) jimpImage.invert();
    await jimpImage.contrast(contrast);
    // if (!dither) await jimpImage.color([{ apply: "xor", params: [50] }]);
    // await jimpImage.contrast(contrast);
    jimpImage.autocrop().scaleToFit(128, 64);

    const jimpPNG = await jimpImage.getBufferAsync("image/png");

    pngImage.parse(jimpPNG, async (err, data) => {
      if (dither) data = fs(data);
      const buffer = PNG.sync.write(data);
      const jimpImage = await Jimp.read(buffer);
      const background = new Jimp(128, 64, "black");
      background.composite(
        jimpImage,
        64 - jimpImage.getWidth() / 2,
        32 - jimpImage.getHeight() / 2
      );
      // console.log(index);
      // console.log(
      //   bitConversion(
      //     gettoConversion(background),
      //     background.getHeight(),
      //     background.getWidth()
      //   )
      // );
      const converted = gettoConversion(background);
      // slice removes bitmap header
      const hexConverted = bitConversion(converted.rgba.slice(54), 128);
      console.log(hexConverted);
      resolve("data:image/bmp;base64," + encode(converted.rgb));
    });
  });
};

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

function App() {
  const [imageArrayBuffers, setABuffer] = useState<ArrayBuffer[]>([]);
  const [contrast, setContrast] = useState<number[]>([]);
  const [dither, setDither] = useState<boolean[]>([]);
  const [invert, setInvert] = useState<boolean[]>([]);
  const [b64Images, setB64Images] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      await Promise.all(
        imageArrayBuffers.map(async (arrayBuffer, index) => {
          console.log(contrast[index]);
          const b64 = await handleFileRead(
            arrayBuffer,
            index,
            contrast[index] ?? 1,
            invert[index],
            dither[index]
          );
          const newB64Images = [...b64Images];
          newB64Images[index] = b64;
          setB64Images(newB64Images);
          return;
        })
      );
    })();
  }, [imageArrayBuffers.length, contrast, invert, dither]);

  return (
    <Main id="appendMe">
      <form
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <input
          type="file"
          onChange={async event => {
            if (event.target.files?.[0]) {
              const arrayBuffer: ArrayBuffer = await handleFileSelect(
                event.target.files[0]
              );
              setInvert([...invert, false]);
              setDither([...dither, false]);
              setContrast([...contrast, 0]);
              setABuffer([...imageArrayBuffers, arrayBuffer]);
            }
          }}
        ></input>
        <button>ogeh</button>
      </form>
      {b64Images.map((b64ImageString, index) => (
        <ImagePreview key={b64ImageString}>
          <PixelatedImage height="256" width="512" src={b64ImageString} />
          <button
            onClick={() => {
              const newContrast = [...contrast];
              newContrast[index] = Math.min((contrast[index] ?? 0) + 0.1, 1);
              setContrast(newContrast);
            }}
          >
            ++
          </button>
          <button
            onClick={() => {
              const newContrast = [...contrast];
              newContrast[index] = Math.min((contrast[index] ?? 0) + 0.02, 1);
              setContrast(newContrast);
            }}
          >
            +
          </button>
          <button
            onClick={() => {
              const newContrast = [...contrast];
              newContrast[index] = Math.max((contrast[index] ?? 0) - 0.02, -1);
              setContrast(newContrast);
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              const newContrast = [...contrast];
              newContrast[index] = Math.max((contrast[index] ?? 0) - 0.1, -1);
              setContrast(newContrast);
            }}
          >
            --
          </button>
          <input
            type="checkbox"
            onChange={() => {
              const newInvert = [...invert];
              newInvert[index] = !invert[index];
              setInvert(newInvert);
            }}
            checked={invert[index]}
          />
          <input
            type="checkbox"
            onChange={() => {
              const newDither = [...dither];
              newDither[index] = !dither[index];
              setDither(newDither);
            }}
            checked={dither[index]}
          />
        </ImagePreview>
      ))}
    </Main>
  );
}

export default App;
