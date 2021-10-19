export const optimizeForSSD1306 = (buffer: Buffer) => {
  // let optimizedImage = new Buffer(0);
  let optimizedImage = Buffer.alloc(0);
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
