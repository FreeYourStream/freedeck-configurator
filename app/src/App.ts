import { spawn } from "child_process";
import { readFileSync } from "fs";
import { join, normalize } from "path";

import { BrowserWindow, Menu, Tray, app, protocol } from "electron";

let globalWin: BrowserWindow;
let tray: Tray;
let forceQuit = false;
const createTray = () => {
  console.log("creating tray");
  tray = new Tray(join(__dirname, "./assets/freedeck.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        globalWin.show();
        globalWin.setSkipTaskbar(false);
      },
    },
    {
      label: "Exit",
      click: () => {
        forceQuit = true;
        app.quit();
      },
    },
  ]);
  tray.on("double-click", function (event) {
    globalWin.show();
  });
  tray.setToolTip("FreeDeck App");
  tray.setContextMenu(contextMenu);
};

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol("file", (request, callback) => {
    const url = request.url.substr(8);
    callback({ path: normalize(`${__dirname}/${url}`) });
  });
}
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
    !app.isPackaged
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
  win.on("close", function (event: any) {
    if (!forceQuit) {
      event.preventDefault();
      win.setSkipTaskbar(true);
      // createTray(); // buggy on linux ATM
      win.hide();
    }
  });
  win.webContents.session.on("serial-port-added", (event, port) => {
    console.log("serial-port-added FIRED WITH", port);
  });

  win.webContents.session.on("serial-port-removed", (event, port) => {
    console.log("serial-port-removed FIRED WITH", port);
  });

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (!app.isPackaged) return true;
      if (permission === "serial" && details.securityOrigin === "file:///") {
        return true;
      }
      return false;
    }
  );

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (!app.isPackaged) return true;
    if (details.deviceType === "serial" && details.origin === "file://") {
      return true;
    }
    return false;
  });
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  setupLocalFilesNormalizerProxy();
  createWindow();
  createTray();
  createWindowSearcher();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const createWindowSearcher = async () => {
  if (process.platform === "win32") {
    let script: string;
    if (!app.isPackaged) {
      script = join(__dirname, "extraResources", "windows.ps1");
    } else {
      script = join(__dirname, "../../", "extraResources", "windows.ps1");
    }
    const proc = spawn("powershell.exe", [
      "-ExecutionPolicy",
      "ByPass",
      "-File",
      script,
    ]);
    proc.stdout.on("data", (data: Buffer) => {
      globalWin.webContents.send("change_page", data.toString());
    });
    proc.stdout.on("error", (data) => console.log(data.toString()));
    proc.stderr.on("data", (data) => console.log(data.toString()));
  } else if (process.platform === "linux") {
    let script: string;
    if (!app.isPackaged) {
      script = join(__dirname, "extraResources", "linux.sh");
    } else {
      script = join(__dirname, "../../", "extraResources", "linux.sh");
    }
    const proc = spawn("/bin/bash", [script]);
    proc.stdout.on("data", (data: Buffer) => {
      globalWin.webContents.send("change_page", data.toString());
    });
    proc.stdout.on("error", (data) => console.log(data.toString()));
    proc.stderr.on("data", (data) => console.log(data.toString()));
  }
};
