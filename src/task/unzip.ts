import { mkdir,rm } from 'fs/promises';
import { unzip } from "../utils/crx";
import { EXTENSION_DATA_CACHE_PATH, EXTENSION_ZIP_PATH } from "../config";

async function run() {
  await mkdir(EXTENSION_DATA_CACHE_PATH, { recursive: true });
  await rm(EXTENSION_DATA_CACHE_PATH, { recursive: true, force: true });
  await unzip(EXTENSION_ZIP_PATH, EXTENSION_DATA_CACHE_PATH);
}

(async () => {
  try {
    await run();
  } catch(e) {
    console.log('unzip error', e);
    throw e;
  }
})();
