import { Config } from "../../generated";
import { createButtonBody, createImageBody } from "./createBody";
import { createFooter } from "./createFooter";
import { createHeader } from "./createHeader";
export const createConfigBuffer = (
  configState: Config,
  saveJson: boolean
): Buffer => {
  let buffer = Buffer.concat([
    createHeader(
      configState.width,
      configState.height,
      configState.brightness,
      configState.screenSaverTimeout,
      configState.oledSpeed,
      configState.oledDelay,
      configState.preChargePeriod,
      Math.min(15, configState.clockFreq) * 16 +
        Math.min(15, configState.clockDiv),
      configState.saveJson,
      configState.pages.sorted.length
    ),
    createButtonBody(configState.pages),
    createImageBody(configState.pages),
  ]);
  if (configState.saveJson || saveJson) {
    buffer = Buffer.concat([buffer, createFooter(configState)]);
  }
  return buffer;
};
