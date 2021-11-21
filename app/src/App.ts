import { spawn } from "child_process";
import { join } from "path";

import { BrowserWindow, app, ipcMain } from "electron";
import isDev from "electron-is-dev";

let globalWin: BrowserWindow;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 750,
    webPreferences: {
      contextIsolation: false,
      // UPDATE: for electron > V12 consider setting contextIsolation and see: https://github.com/electron/electron/issues/9920#issuecomment-797491175
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  globalWin = win;

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${join(__dirname, "./build/index.html")}`
  );
  win.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      event.preventDefault();
      if (portList && portList.length > 0) {
        callback(portList[0].portId);
      } else {
        callback(""); //Could not find any matching devices
      }
    }
  );

  win.webContents.session.on("serial-port-added", (event, port) => {
    console.log("serial-port-added FIRED WITH", port);
  });

  win.webContents.session.on("serial-port-removed", (event, port) => {
    console.log("serial-port-removed FIRED WITH", port);
  });

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (isDev) return true;
      if (permission === "serial" && details.securityOrigin === "file:///") {
        return true;
      }
      return false;
    }
  );

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (isDev) return true;
    if (details.deviceType === "serial" && details.origin === "file://") {
      return true;
    }
    return false;
  });
  if (isDev) {
    win.webContents.openDevTools();
  }
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

setTimeout(() => {
  const proc = spawn("bash", [
    "-c",
    "while true; do xprop -id $(xprop -root 32x '\t$0' _NET_ACTIVE_WINDOW | cut -f 2) _NET_WM_NAME 2>/dev/null | awk -F= '{print($2)}'; sleep 0.1; done",
  ]);
  proc.stdout.on("data", (data: Buffer) => {
    console.log(data.toString());
    globalWin.webContents.send("change_page", data.toString());
  });
});
