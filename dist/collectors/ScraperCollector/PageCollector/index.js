"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageCollector = void 0;
const AbstractCollector_1 = __importDefault(require("../../AbstractCollector"));
const loader_1 = require("../../../utils/loader");
const config_1 = require("../../../config");
class PageCollector extends AbstractCollector_1.default {
    extension;
    browser;
    value = {
        htmlContent: '',
    };
    constructor(extension, browser) {
        super();
        this.extension = extension;
        this.browser = browser;
        this.extension = extension;
        this.browser = browser;
    }
    async start() {
        const mod = await (0, loader_1.loadModule)(__dirname, this.extension.type);
        const page = await this.browser.newPage();
        await page.setViewportSize(config_1.VIDEO_SIZE);
        const { htmlContent } = await mod.scrape(page);
        this.value.htmlContent = htmlContent;
        this.setReady(true);
    }
    getHtmlContent() {
        return this.value.htmlContent;
    }
    getMetrics() {
        return {
            name: 'scrape',
            value: this.value,
        };
    }
    getMetricsValue() {
        return this.value;
    }
}
exports.PageCollector = PageCollector;
//# sourceMappingURL=index.js.map