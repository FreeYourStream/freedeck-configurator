import { Buffer } from "buffer";

import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../App";
import { HEADER_SIZE, IMAGE_SIZE, ROW_SIZE } from "../../constants";
import { monochrome128by64BitmapHeader } from "../../definitions/headers";
import { EAction } from "./parsePage";
import { unoptimizeFromSSD1306 } from "./ssd1306";

// export const parseConfig = (config: Buffer) => {
//   // read offset info in header
//   const offset = config.readUInt16LE(2);
//   const rowOffset = offset * ROW_SIZE;
//   const start = (i: number) => rowOffset + IMAGE_SIZE * i;
//   const end = (i: number) => rowOffset + IMAGE_SIZE * (i + 1);
//   // loop from offset through images and store them
//   const images = [];
//   let i = 0;
//   let image = config.slice(start(i), end(i));
//   while (image.byteLength) {
//     images.push(unoptimizeFromSSD1306(image));
//     i++;
//     image = config.slice(start(i), end(i));
//   }
//   i = 0;

//   const width = config.readUInt8(0);
//   const height = config.readUInt8(1);
//   const buttonCount = width * height;
//   const pageByteSize = buttonCount * ROW_SIZE;
//   const pages = [];
//   const pageStart = (i: number) => HEADER_SIZE + i * pageByteSize;
//   const pageEnd = (i: number) => HEADER_SIZE + (i + 1) * pageByteSize;
//   const pageCount = (offset - 1) / buttonCount;

//   for (i = 0; i < pageCount; i++) {
//     pages.push(config.slice(pageStart(i), pageEnd(i)));
//   }
//   return {
//     width,
//     height,
//     pageCount,
//     pages,
//     images,
//   };
// };

export const parseConfig = (configBuffer: Buffer) => {
  const width = configBuffer.readUInt8(0);
  const height = configBuffer.readUInt8(1);
  const displaysPerPage = width * height;

  const displayButtonCount = configBuffer.readUInt16LE(2) - 1; // subtract 1 for the header row
  const pageCount = displayButtonCount / displaysPerPage;

  const imageOffset = 16 * (displayButtonCount + 1);
  const jsonOffset = imageOffset + 1024 * displayButtonCount;

  if (configBuffer.length === jsonOffset)
    throw new Error(
      "config too old. not compatible yet. please create a new one"
    );

  const jsonConfigSlice = configBuffer.slice(jsonOffset);
  const rawConfig = JSON.parse(jsonConfigSlice.toString());
  const convertedImagePages: IConvertedImagePage[] = [];

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const pageOffset = imageOffset + 1024 * displaysPerPage * pageIndex;
    const convertedImagePage: IConvertedImagePage = [];
    for (let displayIndex = 0; displayIndex < displaysPerPage; displayIndex++) {
      const offset = pageOffset + 1024 * displayIndex;
      const image = unoptimizeFromSSD1306(
        configBuffer.slice(offset, offset + 1024)
      );
      const imageWithHeader = Buffer.concat([
        Buffer.from(monochrome128by64BitmapHeader()),
        image,
      ]);
      convertedImagePage.push(imageWithHeader);
    }
    convertedImagePages.push(convertedImagePage);
  }

  let config: {
    buttonSettingsPages: IButtonPage[];
    defaultBackDisplay: IDefaultBackDisplay;
    displaySettingsPages: IDisplayPage[];
    originalImagePages: IOriginalImagePage[];
    convertedImagePages: IConvertedImagePage[];
  };
  config = {
    buttonSettingsPages: rawConfig.buttonSettingsPages,
    defaultBackDisplay: {
      settings: rawConfig.defaultBackDisplay.settings,
      image: Buffer.from(rawConfig.defaultBackDisplay.image.data),
    },
    displaySettingsPages: rawConfig.displaySettingsPages,
    originalImagePages: rawConfig.originalImagePages.map((originalPage: any) =>
      originalPage.map((image: any) => {
        if (image !== null) return Buffer.from(image.data);
        else return image;
      })
    ),
    convertedImagePages,
  };

  // LEGACY, maybe reactivate for loading old configs
  // for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
  //   const displayPage: IDisplayPage = [];
  //   const buttonPage: IButtonPage = [];
  //   const pageOffset = width * height * 16 * pageIndex + 16;
  //   for (let displayIndex = 0; displayIndex < width * height; displayIndex++) {
  //     const offset = pageOffset + 16 * displayIndex;
  //     const row = configBuffer.slice(offset, offset + 16);

  //     // //primary button
  //     // const primaryModeByte = row.readUInt8(0);
  //     // const secondaryEnabled = primaryModeByte >= 16;
  //     // const primaryMode: EAction = secondaryEnabled
  //     //   ? primaryModeByte - 16
  //     //   : primaryModeByte;
  //     // const primaryValues = [...row.slice(1, 8).values()];

  //     // //secondary button
  //     // const secondaryModeByte = row.readUInt8(8);
  //     // const secondaryMode: EAction =
  //     //   secondaryModeByte >= 16 ? secondaryModeByte - 16 : secondaryModeByte;
  //     // const secondaryValues = [...row.slice(9, 16).values()];

  //     // //create the button page
  //     // buttonPage.push({
  //     //   primary: { enabled: true, mode: primaryMode, values: primaryValues },
  //     //   secondary: {
  //     //     enabled: secondaryEnabled,
  //     //     mode: secondaryMode,
  //     //     values: secondaryValues,
  //     //   },
  //     // });

  //   }
  // }
  return {
    width,
    height,
    ...config,
  };
};
