import { ConfigState } from "../../states/configState";
import { createButtonBody, createImageBody } from "./createBody";
import { createFooter } from "./createFooter";
import { createHeader } from "./createHeader";

export const createConfigBuffer = (configState: ConfigState): Buffer =>
  Buffer.concat([
    createHeader(
      configState.width,
      configState.height,
      configState.brightness,
      configState.screenSaverTimeout,
      configState.pages.sorted.length
    ),
    createButtonBody(configState.pages),
    createImageBody(configState.pages),
    createFooter(configState),
  ]);
