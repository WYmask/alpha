"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crx_1 = require("../utils/crx");
const config_1 = require("../config");
async function run() {
    await (0, crx_1.zip)(config_1.EXTENSION_DATA_CACHE_PATH, config_1.EXTENSION_ZIP_PATH);
}
(async () => {
    await run();
})();
//# sourceMappingURL=zip.js.map