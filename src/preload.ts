import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  pythonExec: (arg: string) => ipcRenderer.invoke("python:exec", arg),
  pythonRepr: (arg: string) => ipcRenderer.invoke("python:repr", arg),
});
