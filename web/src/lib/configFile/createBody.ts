import { Buffer } from "buffer";
import { EAction } from "../../definitions/modes";
import { IPage } from "../../interfaces";
import { optimizeForSSD1306 } from "./ssd1306";

export const createButtonBody = (pages: IPage[]) => {
  const buttonRowCount = pages.length * pages[0].length;
  const buttonRows = new Buffer(16 * buttonRowCount);
  pages.forEach((page, pageIndex) => {
    page.forEach((db, buttonIndex) => {
      const rowOffset = page.length * 16 * pageIndex + buttonIndex * 16;
      // add 16 if the longpress has any functionality
      const secondaryAddition = (db.button.secondary.enabled ? 1 : 0) * 16;

      // first 8 primary bytes
      if (db.button.primary.values.length !== 0) {
        const primaryMode = db.button.primary.mode + secondaryAddition;
        buttonRows.writeUInt8(primaryMode, rowOffset);
        db.button.primary.values.forEach((value, index) =>
          buttonRows.writeUInt8(value, rowOffset + index + 1)
        );
      } else {
        buttonRows.writeUInt8(EAction.noop + secondaryAddition, rowOffset);
      }
      // 8 secondary bytes
      if (db.button.primary.mode === EAction.text) return;
      if (db.button.secondary.values.length !== 0) {
        const secondaryMode = db.button.secondary.mode;
        buttonRows.writeUInt8(secondaryMode, rowOffset + 8);
        db.button.secondary.values.forEach((value, index) =>
          buttonRows.writeUInt8(value, rowOffset + index + 1 + 8)
        );
      } else {
        buttonRows.writeUInt8(EAction.noop + secondaryAddition, rowOffset + 8);
      }
    });
  });
  console.timeEnd("buttons");
  return buttonRows;
};

export const createImageBody = (pages: IPage[]) => {
  let imageBuffer = new Buffer(0);
  const bmpHeaderSize = pages[0][0].display.convertedImage.readUInt32LE(10);
  pages.forEach((page) => {
    page.forEach((db) => {
      imageBuffer = Buffer.concat([
        imageBuffer,
        optimizeForSSD1306(db.display.convertedImage.slice(bmpHeaderSize)),
      ]);
    });
  });
  return imageBuffer;
};
