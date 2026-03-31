import { mkdir, cp } from "fs/promises";
import { resolve } from "path";
import { removeDirectoryContents, fileExists } from "../../utils/fs";
import { patchManifest } from "../../utils/crx";
import {
  EXTENSIONS_PATH,
  PROFILE_PATH,
  EXTENSIONS_DB_PATH,
  EXTENSIONS_SETTINGS_PATH,
  DATA_CACHE_PATH,
  EXTENSION_DATA_CACHE_PATH,
  BROWSER_PATH,
} from "../../config";

export async function setExtensionData(
  extensionId: string,
  key: string
): Promise<void> {
  await removeDirectoryContents(EXTENSIONS_PATH);
  await removeDirectoryContents(EXTENSIONS_DB_PATH);
  await removeDirectoryContents(EXTENSIONS_SETTINGS_PATH);
  await mkdir(EXTENSIONS_PATH, { recursive: true });
  await mkdir(EXTENSIONS_DB_PATH, { recursive: true });
  await mkdir(EXTENSIONS_SETTINGS_PATH, { recursive: true });
  await mkdir(DATA_CACHE_PATH, { recursive: true });
  await cp(DATA_CACHE_PATH, PROFILE_PATH, { recursive: true, force: true });
  
  const extensionPath = resolve(EXTENSIONS_PATH, extensionId);

  if (!(await fileExists(EXTENSIONS_PATH))) console.log('EXTENSIONS_PATH not exists', EXTENSIONS_PATH);
  else console.log('EXTENSIONS_PATH exists', EXTENSIONS_PATH);

  if (!(await fileExists(EXTENSION_DATA_CACHE_PATH))) console.log('EXTENSION_DATA_CACHE_PATH not exists', EXTENSION_DATA_CACHE_PATH);
  else console.log('EXTENSION_DATA_CACHE_PATH exists', EXTENSION_DATA_CACHE_PATH);

  if (!(await fileExists(BROWSER_PATH))) console.log('BROWSER_PATH not exists', BROWSER_PATH);
  else console.log('BROWSER_PATH exists', BROWSER_PATH);

  await patchManifest(extensionPath, key);
}
