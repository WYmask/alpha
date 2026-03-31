import { resolve } from "path";
import { fileExists } from "./fs";

export async function loadModule(
  dir: string,
  module: string,
  filename = "index.js"
) {
  const fullPath = resolve(dir, module, filename);
  if (!(await fileExists(fullPath)))
    throw new Error(`Module ${module} is missing in directory ${dir}`);
  const mod = await import(fullPath);
  return mod;
}
