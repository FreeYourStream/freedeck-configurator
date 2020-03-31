import { ROW_SIZE } from "../../constants";

export const parsePage = (page: Buffer) => {
  const rows = [];
  for (let i = 0; i < page.byteLength / ROW_SIZE; i++) {
    rows.push(page.slice(i * ROW_SIZE, (i + 1) * ROW_SIZE));
  }
  return rows;
};

export enum EAction {
  "keyboard",
  "changeLayout",
  "noop"
}
export interface IRow {
  action: EAction;
  keys: number[];
  page: number;
}

export const parseRow = (row: Buffer): IRow => {
  const action = row.readUInt8(0);
  const keys: number[] = [];
  let page: number = -1;
  if (action === 0) {
    for (let i = 1; i < 16; i++) {
      const key = row.readUInt8(i);
      if (key != 0) keys.push(key);
    }
  }
  if (action === 1) {
    page = row.readUInt16LE(1);
  }

  return {
    action,
    page,
    keys
  };
};
