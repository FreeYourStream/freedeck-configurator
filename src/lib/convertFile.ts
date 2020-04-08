import { Buffer } from "buffer";

import fs from "floyd-steinberg";
import Jimp from "jimp";
import { PNG } from "pngjs";

import { imageToBinaryBuffer } from "./bwConversion";
import { dec2bin } from "./dec2binString";
import { rotateCCW } from "./matrix";
import { pixelBufferToBitmapBuffer } from "./pixelToBitmap";

export interface IConverted {
  bytes: Buffer;
  base64: string;
}

export const composeImage = (
  image: Jimp,
  width: number,
  height: number,
  contrast: number,
  invert: boolean,
  dither: boolean,
  textEnabled: boolean,
  text: string,
  fontName: string
): Promise<Buffer> => {
  return new Promise(async (resolve) => {
    const jimpImage = new Jimp(image);
    const pngImage = new PNG();
    if (invert) jimpImage.invert();
    const background = new Jimp(width, height, "black");
    if (textEnabled) {
      jimpImage.autocrop().scaleToFit(width / 2, height);
      const font = await Jimp.loadFont(fontName);
      const fontSize = font.common.lineHeight - 2;
      let lines = text.split("|").filter((line) => line);
      const overAllLineHeight =
        lines.length * fontSize + (lines.length - 1) * 1;
      const offset = (64 - overAllLineHeight) / 2;
      await Promise.all(
        lines.map(async (line, index) => {
          const lineOffset = offset + fontSize * index;
          await background.print(
            font,
            jimpImage.getWidth() + 3,
            lineOffset,
            line
          );
        })
      );

      await background.contrast(-0.25);
      await jimpImage.contrast(contrast);
      background.composite(
        jimpImage,
        0,
        height / 2 - jimpImage.getHeight() / 2
      );
    } else {
      jimpImage.autocrop().scaleToFit(width, height);
      background.composite(
        jimpImage,
        width / 2 - jimpImage.getWidth() / 2,
        height / 2 - jimpImage.getHeight() / 2
      );
      await background.contrast(contrast);
    }
    const jimpPNG = await background.getBufferAsync("image/png");
    pngImage.parse(jimpPNG, async (err, data) => {
      if (dither) data = fs(data);
      const buffer = PNG.sync.write(data);
      const jimpImage = await Jimp.read(buffer);
      const { binary } = imageToBinaryBuffer(jimpImage, width, height);
      const bytes = pixelBufferToBitmapBuffer(binary);
      resolve(bytes);
    });
  });
};

export const composeText = (
  width: number,
  height: number,
  dither: boolean,
  text: string,
  fontName: string,
  contrast: number
): Promise<Buffer> => {
  return new Promise(async (resolve) => {
    const pngImage = new PNG();
    const textImage = new Jimp(width, height, "black");
    const font = await Jimp.loadFont(fontName);
    const fontSize = font.common.lineHeight - 2;
    let lines = text.split("|").filter((line) => line);
    const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
    const offset = (64 - overAllLineHeight) / 2;
    if (lines.length > 1) {
      await Promise.all(
        lines.map(async (line, index) => {
          const lineOffset = offset + fontSize * index;
          await textImage.print(font, 0, lineOffset, line);
        })
      );
    } else {
      await textImage.print(font, 0, 0, lines[0], 128, 64);
    }
    textImage.autocrop().scaleToFit(width, height);
    const background = new Jimp(width, height, "black");
    background.composite(
      textImage,
      (128 - textImage.getWidth()) / 2,
      (64 - textImage.getHeight()) / 2
    );
    if (dither) background.contrast(contrast);
    const jimpPNG = await background.getBufferAsync("image/png");
    pngImage.parse(jimpPNG, async (err, data) => {
      if (dither) data = fs(data);
      const buffer = PNG.sync.write(data);
      const jimpImage = await Jimp.read(buffer);
      const { binary } = imageToBinaryBuffer(jimpImage, width, height);
      const bytes = pixelBufferToBitmapBuffer(binary);
      resolve(bytes);
    });
  });
};

export const optimizeForSSD1306 = (buffer: Buffer) => {
  let optimizedImage = new Buffer(0);
  let b;

  let dst_mask;
  for (let y = 0; y < 8; y++) {
    // 8 lines of 8 pixels
    for (let j = 0; j < 8; j++) {
      // 8 sections of 16 columns = 128px width
      let s = j * 2 + y * 16 * 8; // source line j*2 because j
      // console.log("s", s);
      const ucTemp = new Array<number>(16).fill(0); // start with all black
      for (let x = 0; x < 16; x += 8) {
        // block of 16x8 pixels
        dst_mask = 1;
        for (let q = 0; q < 8; q++) {
          // console.log("b", s + q * 16);
          b = buffer[s + q * 16];
          for (let z = 0; z < 8; z++) {
            if (b & 0x80) {
              ucTemp[x + z] |= dst_mask;
            }
            b <<= 1;
          } // for z
          dst_mask <<= 1;
        } // for q
        s++; // next source uint8_t
      } // for x
      optimizedImage = Buffer.concat([optimizedImage, Buffer.from(ucTemp)]);
      //oledCachedWrite(ucTemp, 16);
    } // for j
  }
  return Buffer.from(optimizedImage);
};

export const unoptimizeFromSSD1306 = (buffer: Buffer) => {
  const image = [...buffer];
  // return Buffer.from(image);
  let optimizedImage = new Buffer(1024);
  for (let k = 0; k < 8; k++) {
    // 8 rows form a display
    for (let j = 0; j < 16; j++) {
      // 16 packages form a row
      const bytes: string[][] = [];
      for (let i = 0; i < 8; i++) {
        // each byte column in an 8 byte package
        let byte = image.splice(0, 1);
        bytes.push(dec2bin(byte[0]));
      }
      const rotated = rotateCCW(bytes);
      const rotatedBytes = rotated.map((byte) => parseInt(byte.join(""), 2));
      rotatedBytes.forEach((rotatedByte, index) => {
        optimizedImage.writeUInt8(rotatedByte, k * 128 + j + index * 16);
      });
    }
  }
  //return buffer;
  return optimizedImage;
};
