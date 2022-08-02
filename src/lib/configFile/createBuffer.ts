import { Config } from "../../generated";
import { createButtonBody, createImageBody } from "./createBody";
import { createFooter } from "./createFooter";
import { createHeader } from "./createHeader";
export const createConfigBuffer = (configState: Config): Buffer =>
  Buffer.concat([
    createHeader(
      configState.width,
      configState.height,
      configState.brightness,
      configState.screenSaverTimeout,
      configState.oledSpeed,
      configState.preChargePeriod,
      Math.min(15, configState.clockFreq) * 16 +
        Math.min(15, configState.clockDiv),
      configState.pages.sorted.length
    ),
    createButtonBody(configState.pages),
    createImageBody(configState.pages),
    createFooter(configState),
  ]);
