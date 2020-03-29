import { ROW_SIZE } from "../../constants";

export const parsePage = (page: Buffer) => {
  const rows = [];
  for (let i = 0; i < page.byteLength / ROW_SIZE; i++) {
    rows.push(page.slice(i * ROW_SIZE, (i + 1) * ROW_SIZE));
  }
  return rows;
};

export interface IRow {
  imageIndex: number;
  action: "keyboard" | "changeLayout" | "noop";
  keys: number[];
}

export const parseRow = (row: Buffer): IRow => {
  const imageIndex = row.readUInt16BE(0);
  const action = row.readUInt8(2);
  const keys: number[] = [];

  if (action === 0) {
    for (let i = 3; i < 16; i++) {
      keys.push(row.readUInt8(i));
    }
  }

  return {
    imageIndex,
    action: action === 0 ? "keyboard" : action === 1 ? "changeLayout" : "noop",
    keys
  };
};
