import { Buffer } from "buffer";

import {
  IButtonPage,
  IConvertedImagePage,
  IDefaultBackDisplay,
  IDisplayPage,
  IOriginalImagePage,
} from "../../interfaces";
import { monochrome128by64BitmapHeader } from "../../definitions/headers";
import { unoptimizeFromSSD1306 } from "./ssd1306";

export const parseConfig = (configBuffer: Buffer) => {
  const width = configBuffer.readUInt8(0);
  const height = configBuffer.readUInt8(1);
  const brightness = configBuffer.readUInt8(4);
  const displaysPerPage = width * height;

  const displayButtonCount = configBuffer.readUInt16LE(2) - 1; // subtract 1 for the header row

  const imageOffset = 16 * (displayButtonCount + 1);
  const jsonOffset = imageOffset + 1024 * displayButtonCount;

  if (configBuffer.length === jsonOffset) {
    alert("config too old. not compatible yet. please create a new one");
    throw new Error(
      "config too old. not compatible (yet). please create a new one"
    );
  }
  const jsonConfigSlice = configBuffer.slice(jsonOffset);
  const rawConfig = JSON.parse(jsonConfigSlice.toString());
  const convertedImagePages: IConvertedImagePage[] = [];

  const pageCount = displayButtonCount / displaysPerPage;
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
    brightness,
    ...config,
  };
};
