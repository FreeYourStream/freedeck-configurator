import { ROW_SIZE } from "../constants";

export default (width: number, height: number, previousPageIndex: number) => {
  const buffer = new Buffer(width * height * ROW_SIZE);
  for (let i = 0; i < width * height; i++) {
    buffer.writeUInt8(1, ROW_SIZE * i);
    buffer.writeInt16LE(-1, ROW_SIZE * i + 1);
  }
  buffer.writeInt16LE(previousPageIndex, 1);
  return buffer;
};
