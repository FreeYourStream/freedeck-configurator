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
  "noop",
  "special_keys",
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
  if (action === 0 || action === 3) {
    for (let i = 0; i < 7; i++) {
      const key = row.readInt16LE(i * 2 + 1);
      if (key != 0) keys.push(key);
    }
  }
  if (action === 1) {
    page = row.readInt16LE(1);
  }

  return {
    action,
    page,
    keys,
  };
};
