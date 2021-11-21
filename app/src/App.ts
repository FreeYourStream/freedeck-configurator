import { BrowserWindow, app } from "electron";
import isDev from "electron-is-dev";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 750,
  });

  win.loadURL(isDev ? "http://localhost:3000" : "./build/index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
