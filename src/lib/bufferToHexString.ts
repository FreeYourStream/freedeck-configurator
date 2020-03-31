export const bitConversion = (data: Uint8Array, canvasWidth: number) => {
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
      (index !== 0 && (index / 4 + 1) % canvasWidth === 0) ||
      index === data.length - 4
    ) {
      for (var i = byteIndex; i > -1; i--) {
        number += Math.pow(2, i);
      }
      byteIndex = -1;
    }

    // When we have the complete 8 bits, combine them into a hex value
    if (byteIndex < 0) {
      var byteSet = number.toString(16);
      if (byteSet.length === 1) {
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

export const binaryConversion = (data: Buffer) => {
  const reversed = data;
  const arr: number[] = [];
  for (let i = 0; i < data.byteLength / 8; i++) {
    let pixels = 0;
    pixels += 128 * (reversed[i * 8] / 255);
    pixels += 64 * (reversed[i * 8 + 1] / 255);
    pixels += 32 * (reversed[i * 8 + 2] / 255);
    pixels += 16 * (reversed[i * 8 + 3] / 255);
    pixels += 8 * (reversed[i * 8 + 4] / 255);
    pixels += 4 * (reversed[i * 8 + 5] / 255);
    pixels += 2 * (reversed[i * 8 + 6] / 255);
    pixels += 1 * (reversed[i * 8 + 7] / 255);
    arr.push(pixels);
  }
  return Buffer.from(arr);
};
