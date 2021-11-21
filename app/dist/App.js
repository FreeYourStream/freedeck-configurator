"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const electron_1 = require("electron");
const electron_is_dev_1 = (0, tslib_1.__importDefault)(require("electron-is-dev"));
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 1400,
        height: 750,
    });
    win.loadURL(electron_is_dev_1.default ? "http://localhost:3000" : "./build/index.html");
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
