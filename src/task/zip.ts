import { zip } from "../utils/crx";
import { EXTENSION_DATA_CACHE_PATH, EXTENSION_ZIP_PATH } from "../config";

async function run() {
  await zip(EXTENSION_DATA_CACHE_PATH, EXTENSION_ZIP_PATH);
}

(async () => {
  await run();
})();
