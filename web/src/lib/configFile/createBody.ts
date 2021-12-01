import { Buffer } from "buffer";

import { EAction } from "../../definitions/modes";
import { FDSettings, IDisplayButton, IPages } from "../../interfaces";
import { optimizeForSSD1306 } from "./ssd1306";

const writeAction = (
  buttonRows: Buffer,
  db: IDisplayButton,
  pages: IPages,
  rowOffset: number,
  isSecondary: boolean
) => {
  const secondaryAddition =
    (!isSecondary && db.button.secondary.enabled ? 1 : 0) * 16;
  const buttonAction = isSecondary ? db.button.secondary : db.button.primary;
  const dataOffset = rowOffset + (isSecondary ? 8 : 0);
  buttonRows.writeUInt8(buttonAction.mode + secondaryAddition, dataOffset);
  switch (buttonAction.mode) {
    case EAction.changePage:
      const pageIndex = pages.sorted.findIndex(
        (id) => id === buttonAction.values[EAction.changePage]
      );
      buttonRows.writeUInt8(pageIndex, dataOffset + 1);
      break;
    case EAction.hotkeys:
      buttonAction.values[EAction.hotkeys].forEach((hotkey, index) =>
        buttonRows.writeUInt8(hotkey, dataOffset + index + 1)
      );
      break;
    case EAction.special_keys:
      buttonRows.writeUInt8(
        buttonAction.values[EAction.special_keys],
        dataOffset + 1
      );
      break;
    case EAction.text:
      buttonAction.values[EAction.text].forEach((text, index) =>
        buttonRows.writeUInt8(text, dataOffset + index + 1)
      );
      break;
    case EAction.settings:
      buttonRows.writeUInt8(
        buttonAction.values[EAction.settings].setting!,
        dataOffset + 1
      );
      if (
        buttonAction.values[EAction.settings].setting ===
        FDSettings.absolute_brightness
      )
        buttonRows.writeUInt8(
          buttonAction.values[EAction.settings].value!,
          dataOffset + 2
        );

      break;
  }
  return buttonRows;
};

export const createButtonBody = (pages: IPages) => {
  const buttonRowCount =
    pages.sorted.length * pages.byId[pages.sorted[0]].displayButtons.length;
  let buttonRows = new Buffer(16 * buttonRowCount);
  Object.entries(pages.byId).forEach(([pageId, page], pageIndex) => {
    page.displayButtons.forEach((db, buttonIndex) => {
      const rowOffset =
        page.displayButtons.length * 16 * pageIndex + buttonIndex * 16;
      // add 16 if the longpress has any functionality
      buttonRows = writeAction(buttonRows, db, pages, rowOffset, false);
      if (
        db.button.primary.mode !== EAction.text &&
        db.button.secondary.enabled
      ) {
        buttonRows = writeAction(buttonRows, db, pages, rowOffset, true);
      }
    });
  });
  console.timeEnd("buttons");
  return buttonRows;
};

export const createImageBody = (pages: IPages) => {
  let imageBuffer = new Buffer(0);
  const bmpHeaderSize =
    pages.byId[
      pages.sorted[0]
    ].displayButtons[0].display.convertedImage.readUInt32LE(10);
  Object.entries(pages.byId).forEach(([id, page]) => {
    page.displayButtons.forEach((db) => {
      imageBuffer = Buffer.concat([
        imageBuffer,
        optimizeForSSD1306(db.display.convertedImage.slice(bmpHeaderSize)),
      ]);
    });
  });
  return imageBuffer;
};
