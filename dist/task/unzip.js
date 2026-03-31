"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const crx_1 = require("../utils/crx");
const config_1 = require("../config");
async function run() {
    await (0, promises_1.mkdir)(config_1.EXTENSION_DATA_CACHE_PATH, { recursive: true });
    await (0, promises_1.rm)(config_1.EXTENSION_DATA_CACHE_PATH, { recursive: true, force: true });
    await (0, crx_1.unzip)(config_1.EXTENSION_ZIP_PATH, config_1.EXTENSION_DATA_CACHE_PATH);
}
(async () => {
    try {
        await run();
    }
    catch (e) {
        console.log('unzip error', e);
        throw e;
    }
})();
//# sourceMappingURL=unzip.js.map