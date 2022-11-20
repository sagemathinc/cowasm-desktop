import debug from "debug";
//import asyncPython, { PythonWasmAsync } from "python-wasm";
import { asyncPython } from "python-wasm";
interface PythonWasmAsync {
  repr: (s: string) => Promise<string>;
  exec: (s: string) => Promise<void>;
}

const log = debug("python");

let python: PythonWasmAsync | null = null;
// todo: reuseInFlight...?
async function getPython(): Promise<PythonWasmAsync> {
  if (python == null) {
    python = await asyncPython();
  }
  return python;
}

export async function repr(s: string): Promise<string> {
  const p = await getPython();
  return await p.repr(s);
}

export async function exec(s: string): Promise<void> {
  const p = await getPython();
  await p.exec(s);
}
