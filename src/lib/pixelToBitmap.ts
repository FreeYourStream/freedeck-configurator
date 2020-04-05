export const pixelBufferToBitmapBuffer = (data: Buffer) => {
  const reversed = data;
  const arr: number[] = [];
  for (let i = 0; i < data.byteLength / 8; i++) {
    arr.push(
      parseInt(
        reversed
          .slice(i * 8, (i + 1) * 8)
          .map((byte) => (byte === 255 ? 1 : 0))
          .join(""),
        2
      )
    );
  }
  return Buffer.from(arr);
};
