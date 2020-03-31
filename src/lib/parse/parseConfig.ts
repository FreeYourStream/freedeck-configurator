import { ROW_SIZE, IMAGE_SIZE, HEADER_SIZE } from "../../constants";

export const parseConfig = (config: Buffer) => {
  // read offset info in header
  const offset = config.readUInt16LE(2);
  const rowOffset = offset * ROW_SIZE;
  const start = (i: number) => rowOffset + IMAGE_SIZE * i;
  const end = (i: number) => rowOffset + IMAGE_SIZE * (i + 1);
  // loop from offset through images and store them
  const images = [];
  let i = 0;
  let image = config.slice(start(i), end(i));
  while (image.byteLength) {
    images.push(image);
    i++;
    image = config.slice(start(i), end(i));
  }
  i = 0;

  const width = config.readUInt8(0);
  const height = config.readUInt8(1);
  const buttonCount = width * height;
  const pageByteSize = buttonCount * ROW_SIZE;
  const pages = [];
  const pageStart = (i: number) => HEADER_SIZE + i * pageByteSize;
  const pageEnd = (i: number) => HEADER_SIZE + (i + 1) * pageByteSize;
  const pageCount = (offset - 1) / buttonCount;

  for (i = 0; i < pageCount; i++) {
    pages.push(config.slice(pageStart(i), pageEnd(i)));
  }
  return {
    width,
    height,
    pageCount,
    pages,
    images
  };
};
