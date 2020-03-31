import { ROW_SIZE } from "../constants";

export default (width: number, height: number) => {
  const buffer = new Buffer(width * height * ROW_SIZE);
  for (let i = 0; i < width * height; i++) {
    buffer.writeUInt8(2, ROW_SIZE * i);
  }
  return buffer;
};
