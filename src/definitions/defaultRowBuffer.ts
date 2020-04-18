import { ROW_SIZE } from "../constants";

export default (width: number, height: number, previousPageIndex: number) => {
  const buffer = new Buffer(width * height * ROW_SIZE);
  for (let i = 0; i < width * height; i++) {
    buffer.writeUInt8(2, ROW_SIZE * i);
    buffer.writeInt16LE(-1, ROW_SIZE * i + 1);
    buffer.writeUInt8(2, ROW_SIZE * i + 8);
    buffer.writeInt16LE(-1, ROW_SIZE * i + 1 + 8);
  }
  if (previousPageIndex >= 0) {
    buffer.writeUInt8(1, 0);
    buffer.writeInt16LE(previousPageIndex, 1);
  }
  return buffer;
};
