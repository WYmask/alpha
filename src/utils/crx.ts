import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import AdmZip from "adm-zip";
import { fileExists } from "./fs";

export async function patchManifest(
  targetDir: string,
  key: string
): Promise<void> {
  const manifestPath = join(targetDir, "manifest.json");
  const manifestContent = await readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestContent);
  manifest.permissions ??= [];
  manifest.permissions.push(...["system.memory", "management"]);
  if (key) manifest.key = key;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const swPath = join(targetDir, manifest.background.service_worker);
  const text = await readFile(swPath, "utf-8");
  await writeFile(
    swPath,
    "chrome.runtime.onInstalled.addListener = () => {};" + text
  );
}

export async function zip(src: string, dest: string): Promise<void> {
  if (!(await fileExists(src))) return;
  const zip = new AdmZip();
  zip.addLocalFolder(src);
  zip.writeZip(dest);
}

export async function unzip(src: string, dest: string): Promise<void> {
  if (!(await fileExists(src))) return;
  const zip = new AdmZip(src);
  zip.extractAllTo(dest);
}