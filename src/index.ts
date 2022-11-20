import { app, BrowserWindow, ipcMain } from "electron";
import * as python from "./python";
import { join } from "path";

if (require("electron-squirrel-startup")) {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  app.quit();
}

declare global {
  interface Window {
    electronAPI: {
      pythonExec: (arg: string) => Promise<void>;
      pythonRepr: (arg: string) => Promise<string>;
    };
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  console.log(__dirname);
  mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  mainWindow.webContents.openDevTools();
};
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.setMaxListeners(100);

ipcMain.handle(
  "python:exec",
  async (_event, arg: string) => await python.exec(arg)
);
ipcMain.handle(
  "python:repr",
  async (_event, arg: string) => await python.repr(arg)
);

async function main() {
  await app.whenReady();

  createWindow();
}

main();
