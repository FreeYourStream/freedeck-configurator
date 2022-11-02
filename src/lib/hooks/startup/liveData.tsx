import { useEffect } from "react";
import * as workerInterval from "worker-interval";

import { StateRef } from "../../../App";
import { getEmptyConvertedImage } from "../../../definitions/emptyConvertedImage";
import { monochrome128by64BitmapHeader } from "../../../definitions/headers";
import { Config, DisplayButton, LiveMode } from "../../../generated";
import { AppState } from "../../../states/appState";
import { colorBitmapToMonochromeBitmap } from "../../image/colorToMonoBitmap";
import { _composeText } from "../../image/composeImage";

const composeGraph = async (
  label: string,
  values: number[],
  unit: string,
  line: boolean,
  half = false
) => {
  const Jimp = (await import("jimp")).default;
  let image = new Jimp(128, half ? 32 : 64, "#000000");
  const fontMedium = await Jimp.loadFont("fonts/medium.fnt");
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const y = Math.round((value / 105) * (half ? 32 : 64));
    if (line) {
      image.setPixelColor(0xffffff, i * 2, half ? 32 - y : 64 - y);
      image.setPixelColor(0xffffff, i * 2, half ? 32 - y - 1 : 64 - y - 1);
      image.setPixelColor(0xffffff, i * 2 + 1, half ? 32 - y : 64 - y);
      image.setPixelColor(0xffffff, i * 2 + 1, half ? 32 - y - 1 : 64 - y - 1);
    } else {
      const bar = new Jimp(2, y, "#ffffff");
      image.composite(bar, i * 2, half ? 32 - y : 64 - y);
    }
  }
  const text = new Jimp(128, half ? 32 : 64);
  text.print(
    fontMedium,
    4,
    half ? 10 : 40,
    `${label}: ${values[values.length - 1].toFixed(1)}${unit}`
  );
  for (let x = 0; x < image.getWidth(); x++) {
    for (let y = 0; y < image.getHeight(); y++) {
      const color = Jimp.intToRGBA(text.getPixelColor(x, y));
      const hasText = color.r >= 128 && color.g >= 128 && color.b >= 128;
      if (hasText) {
        const color = Jimp.intToRGBA(image.getPixelColor(x, y));
        const hasImage = color.r >= 128 && color.g >= 128 && color.b >= 128;
        image.setPixelColor(hasImage ? 0 : 0xffffff, x, y);
      }
    }
  }
  const bitmapBuffer = await image.getBufferAsync("image/bmp");
  return await colorBitmapToMonochromeBitmap(bitmapBuffer, 128, half ? 32 : 64);
};

const composeDualData = async (
  liveModeTop: LiveMode,
  liveModeBottom: LiveMode,
  system: AppState["system"]
) => {
  let topImage = await composeSingleData(liveModeTop, system, true);
  let bottomImage = await composeSingleData(liveModeBottom, system, true);
  const headerSize = topImage.readUInt32LE(10); // 130
  const topHalf = topImage.slice(headerSize);
  const bottomHalf = bottomImage.slice(headerSize);
  const newImage = Buffer.concat([
    Buffer.from(monochrome128by64BitmapHeader()),
    topHalf,
    bottomHalf,
  ]);
  return newImage;
};

const composeSingleData = async (
  liveMode: LiveMode,
  system: AppState["system"],
  half = false
) => {
  if (liveMode === "cpu_temp")
    return await _composeText(
      {
        font: "fonts/medium.fnt",
        position: "bottom",
        text: `CPU: ${system.cpuTemp[system.cpuTemp.length - 1].toFixed(1)}C`,
      },
      128,
      half ? 32 : 64
    );
  if (liveMode === "gpu_temp")
    return await _composeText(
      {
        font: "fonts/medium.fnt",
        position: "bottom",
        text: `GPU: ${system.gpuTemp[system.gpuTemp.length - 1].toFixed(1)}C`,
      },
      128,
      half ? 32 : 64
    );
  if (liveMode === "cpu_temp_graph") {
    return await composeGraph("CPU", system.cpuTemp, "C", false, half);
  }
  if (liveMode === "gpu_temp_graph") {
    return await composeGraph("GPU", system.gpuTemp, "C", false, half);
  }
  if (liveMode === "cpu_temp_line") {
    return await composeGraph("CPU", system.cpuTemp, "C", true, half);
  }
  if (liveMode === "gpu_temp_line") {
    return await composeGraph("GPU", system.gpuTemp, "C", true, half);
  }
  return getEmptyConvertedImage();
};

const composeLiveDisplay = async (
  db: DisplayButton,
  system: AppState["system"]
) => {
  if (!db.live) return;
  if (
    (db.live.top !== "none" && db.live.bottom === "none") ||
    (db.live.top === "none" && db.live.bottom !== "none")
  ) {
    const liveData = db.live.top === "none" ? db.live.bottom : db.live.top;
    return await composeSingleData(liveData, system);
  } else if (db.live.top !== "none" && db.live.bottom !== "none") {
    return await composeDualData(db.live.top, db.live.bottom, system);
  }
};

const updateLiveDisplays = async (
  configState: Config,
  appState: AppState,
  refData: StateRef
) => {
  let deck = refData.current.deck;
  if (deck === undefined || deck.dontSwitchPage || deck.currentPage === null)
    return;
  const pageId = configState.pages.sorted[deck.currentPage];
  const page = configState.pages.byId[pageId];
  if (!page) return;
  if (!appState.serialApi?.connected) return;
  let dbIndex = 0;
  for (const db of page.displayButtons) {
    const image = await composeLiveDisplay(db, appState.system);
    if (image) {
      await appState.serialApi
        ?.sendImageToScreen(image, dbIndex)
        .catch(() => {});
    }
    dbIndex++;
  }
};
export const useLiveData = (
  configState: Config,
  appState: AppState,
  refData: StateRef
) => {
  useEffect(() => {
    if (!(window as any).__TAURI_IPC__) return;

    let isCancelled = false;
    let unlistenSerialCommand: string | null;
    const startListen = async () => {
      if (isCancelled) return;
      setTimeout(() => {
        updateLiveDisplays(configState, appState, refData);
      });
      unlistenSerialCommand = workerInterval.setInterval(async () => {
        updateLiveDisplays(configState, appState, refData);
      }, 1000);
    };

    startListen();

    return () => {
      isCancelled = true;
      unlistenSerialCommand &&
        workerInterval.clearInterval(unlistenSerialCommand);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configState, appState.serialApi, appState.deck]);
};
