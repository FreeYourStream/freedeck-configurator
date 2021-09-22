import { Buffer } from "buffer";

import { IButtonPage, IConvertedImagePage } from "../../interfaces";
import { EAction } from "../../definitions/modes";
import { optimizeForSSD1306 } from "./ssd1306";

export const createButtonBody = (buttonPages: IButtonPage[]) => {
  const buttonRowCount = buttonPages.length * buttonPages[0].length;
  const buttonRows = new Buffer(16 * buttonRowCount);
  buttonPages.forEach((buttonPage, pageIndex) => {
    buttonPage.forEach((button, buttonIndex) => {
      const rowOffset = buttonPage.length * 16 * pageIndex + buttonIndex * 16;
      // add 16 if the longpress has any functionality
      const secondaryAddition = (button.secondary.enabled ? 1 : 0) * 16;

      // first 8 primary bytes
      if (button.primary.values.length !== 0) {
        const primaryMode = button.primary.mode + secondaryAddition;
        buttonRows.writeUInt8(primaryMode, rowOffset);
        button.primary.values.forEach((value, index) =>
          buttonRows.writeUInt8(value, rowOffset + index + 1)
        );
      } else {
        buttonRows.writeUInt8(EAction.noop + secondaryAddition, rowOffset);
      }
      // 8 secondary bytes
      if (button.primary.mode === EAction.text) return;
      if (button.secondary.values.length !== 0) {
        const secondaryMode = button.secondary.mode;
        buttonRows.writeUInt8(secondaryMode, rowOffset + 8);
        button.secondary.values.forEach((value, index) =>
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

export const createImageBody = (imagePages: IConvertedImagePage[]) => {
  let imageBuffer = new Buffer(0);
  const bmpHeaderSize = imagePages[0][0].readUInt32LE(10);
  imagePages.forEach((imagePage) => {
    imagePage.forEach((image) => {
      imageBuffer = Buffer.concat([
        imageBuffer,
        optimizeForSSD1306(image.slice(bmpHeaderSize)),
      ]);
    });
  });
  return imageBuffer;
};
