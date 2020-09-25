import { rotateCCW } from "../matrix";

export const dec2bin = (dec: number, length = 8) => {
  const result = (dec >>> 0).toString(2).split("");
  while (result.length < length) {
    result.unshift("0");
  }
  return result;
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
