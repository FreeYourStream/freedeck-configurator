import { ActionValue, EAction, FDSettings } from "../../definitions/modes";
import { DisplayButton, Pages } from "../../generated";
import { ROW_SIZE } from "./consts";
import { optimizeForSSD1306 } from "./ssd1306";

const writeAction = (
  buttonRows: Buffer,
  db: DisplayButton,
  pages: Pages,
  rowOffset: number,
  isSecondary: boolean
) => {
  const buttonAction = isSecondary ? db.button.secondary : db.button.primary;
  const dataOffset = rowOffset + (isSecondary ? ROW_SIZE / 2 : 0);
  buttonRows.writeUInt8(
    //@ts-ignore
    ActionValue[buttonAction.mode],
    dataOffset
  );
  switch (buttonAction.mode) {
    case EAction.changePage:
      const pageIndex = pages.sorted.findIndex(
        (id) => id === buttonAction.values[EAction.changePage]
      );
      buttonRows.writeUInt16LE(pageIndex, dataOffset + 1);
      break;
    case EAction.hotkeys:
      buttonAction.values[EAction.hotkeys].forEach((hotkey, index) => {
        buttonRows.writeUInt8(hotkey, dataOffset + index + 1);
      });
      break;
    case EAction.special_keys:
      buttonRows.writeUInt8(
        buttonAction.values[EAction.special_keys],
        dataOffset + 1
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
  const pageIndex = pages.sorted.findIndex(
    (id) =>
      id === db.button[isSecondary ? "secondary" : "primary"].leavePage.pageId
  );
  buttonRows.writeUInt16LE(pageIndex + 1, dataOffset + ROW_SIZE / 2 - 2);

  return buttonRows;
};

export const createButtonBody = (pages: Pages) => {
  const buttonRowCount =
    pages.sorted.length * pages.byId[pages.sorted[0]].displayButtons.length;
  let buttonRows = new Buffer(ROW_SIZE * buttonRowCount);
  pages.sorted.forEach((pageId, pageIndex) => {
    const page = pages.byId[pageId];
    page.displayButtons.forEach((db, buttonIndex) => {
      const rowOffset =
        page.displayButtons.length * ROW_SIZE * pageIndex +
        buttonIndex * ROW_SIZE;
      buttonRows = writeAction(buttonRows, db, pages, rowOffset, false);
      buttonRows = writeAction(buttonRows, db, pages, rowOffset, true);
    });
  });
  return buttonRows;
};

export const createImageBody = (pages: Pages) => {
  let imageBuffer = new Buffer(0);
  const bmpHeaderSize =
    pages.byId[
      pages.sorted[0]
    ].displayButtons[0].display.convertedImage.readUInt32LE(10);
  console.log(bmpHeaderSize);
  pages.sorted.forEach((id) => {
    const page = pages.byId[id];
    page.displayButtons.forEach((db) => {
      const hasLiveData = new Buffer(1);
      hasLiveData.writeUInt8(
        db.live.top !== "none" || db.live.bottom !== "none" ? 1 : 0,
        0
      );
      imageBuffer = Buffer.concat([
        imageBuffer,
        hasLiveData,
        optimizeForSSD1306(db.display.convertedImage.slice(bmpHeaderSize)),
      ]);
    });
  });
  return imageBuffer;
};
