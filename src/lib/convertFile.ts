import { Buffer } from "buffer";

import fs from "floyd-steinberg";
import Jimp from "jimp";

import { IImageDisplay } from "../App";
import { imageToBinaryBuffer } from "./bwConversion";
import { dec2bin } from "./dec2binString";
import { rotateCCW } from "./matrix";
import { pixelBufferToBitmapBuffer } from "./pixelToBitmap";

export interface IConverted {
  bytes: Buffer;
  base64: string;
}

export const composeImage = async (
  image: Buffer,
  width: number,
  height: number,
  settings: IImageDisplay
): Promise<Buffer> => {
  const { imageSettings, textWithIconSettings, textSettings } = settings;

  let jimpImage = await Jimp.read(image);
  const ditherBackground = await Jimp.create(
    jimpImage.getWidth(),
    jimpImage.getHeight(),
    imageSettings.invert ? "#ffffff" : "#000000"
  );
  jimpImage = await ditherBackground.composite(jimpImage, 0, 0);
  await jimpImage.contrast(imageSettings.contrast);
  await jimpImage.autocrop();
  if (imageSettings.dither) jimpImage.bitmap = fs(jimpImage.bitmap); //await ditherImage(await jimpImage.getBufferAsync("image/png"));
  if (imageSettings.invert) jimpImage.invert();

  const background = new Jimp(width, height, "black");

  if (textWithIconSettings.enabled) {
    jimpImage.scaleToFit(
      width * textWithIconSettings.iconWidthMultiplier,
      height
    );
    const font = await Jimp.loadFont(textSettings.font);
    const fontSize = font.common.lineHeight - 2;
    let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
    const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
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
    background.composite(jimpImage, 0, height / 2 - jimpImage.getHeight() / 2);
  } else {
    jimpImage.scaleToFit(width, height);
    background.composite(
      jimpImage,
      width / 2 - jimpImage.getWidth() / 2,
      height / 2 - jimpImage.getHeight() / 2
    );
  }
  const { binary } = imageToBinaryBuffer(background, width, height);
  const bytes = pixelBufferToBitmapBuffer(binary);
  return bytes;
};

export const composeText = async (
  width: number,
  height: number,
  settings: IImageDisplay
): Promise<Buffer> => {
  const { textSettings } = settings;
  const image = await Jimp.create(128, 64, "black");
  const font = await Jimp.loadFont(textSettings.font);
  const fontSize = font.common.lineHeight - 2;
  let lines = textSettings.text.split(/\r?\n/).filter((line) => line);
  const overAllLineHeight = lines.length * fontSize + (lines.length - 1) * 1;
  const offset = (64 - overAllLineHeight) / 2;
  await Promise.all(
    lines.map(async (line, index) => {
      const lineOffset = offset + fontSize * index;
      await image.print(
        font,
        (128 - (line.length * fontSize) / 2) / 2,
        lineOffset,
        line
      );
    })
  );
  const background = await Jimp.create(128, 64, "black");
  background.composite(
    image,
    (128 - image.getWidth()) / 2,
    (64 - image.getHeight()) / 2
  );
  const { binary } = imageToBinaryBuffer(background, width, height);
  const bytes = pixelBufferToBitmapBuffer(binary);
  return bytes;
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
