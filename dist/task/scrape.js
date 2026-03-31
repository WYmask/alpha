"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const log_1 = require("../utils/log");
const ScraperCollector_1 = require("../collectors/ScraperCollector");
const MetricsRegistry_1 = require("../registry/MetricsRegistry");
async function run() {
    const [, , extensionId, , headless] = process.argv;
    const extension = config_1.EXTENSIONS.find((data) => data.extensionId === extensionId);
    if (extension) {
        const registry = new MetricsRegistry_1.MetricsRegistry();
        const scraperCollector = new ScraperCollector_1.ScraperCollector(extension, headless === "true");
        await registry.register(scraperCollector);
        const timer = setTimeout(async () => {
            clearTimeout(timer);
            await registry.stopAll();
            const reportData = registry.exportMetricsValue();
            // 输出 JSON 到 stdout，便于通过管道传递给其他命令
            console.log(JSON.stringify(reportData, null, 2));
        }, 1000);
    }
    else {
        (0, log_1.log)("ExtensionId invalid");
    }
}
(async () => {
    try {
        await run();
    }
    catch (error) {
        process.stderr.write(`Run scrape error: ${error}\n`);
    }
})();
//# sourceMappingURL=scrape.js.map