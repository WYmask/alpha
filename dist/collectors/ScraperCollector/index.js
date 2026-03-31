"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperCollector = void 0;
const playwright_1 = require("playwright");
const path_1 = require("path");
const AbstractCollector_1 = __importDefault(require("../AbstractCollector"));
const config_1 = require("../../config");
const MetricsRegistry_1 = require("../../registry/MetricsRegistry");
const log_1 = require("../../utils/log");
const unzipExtension_1 = require("../../lib/unzipExtension");
const unlockWallet_1 = require("./unlockWallet");
const AlphaRadar_1 = require("./PageCollector/AlphaRadar");
const report_1 = require("../../utils/report");
class ScraperCollector extends AbstractCollector_1.default {
    extension;
    headless;
    registry = new MetricsRegistry_1.MetricsRegistry();
    browser = null;
    collectedProjects = [];
    constructor(extension, headless) {
        super();
        this.extension = extension;
        this.headless = headless;
        this.extension = extension;
        this.headless = headless;
    }
    async start() {
        if (!this.extension) {
            throw new Error("No extension installed");
        }
        await (0, unzipExtension_1.setExtensionData)(this.extension.extensionId, this.extension.key);
        const extensionId = this.extension.extensionId;
        (0, log_1.log)(`Start scraping with extension ${extensionId}`);
        const dir = (0, path_1.join)(config_1.EXTENSIONS_PATH, extensionId);
        const options = {
            headless: this.headless,
            channel: "chromium",
            args: [
                `--load-extension=${dir}`,
                `--disable-extensions-except=${dir}`,
            ],
        };
        if (this.headless) {
            options.recordVideo = {
                dir: config_1.REPORT_PATH,
                size: config_1.VIDEO_SIZE
            };
        }
        const browser = await playwright_1.chromium.launchPersistentContext(config_1.USER_DATA_PATH, options);
        const page = await browser.newPage();
        if (this.headless) {
            await page.setViewportSize(config_1.VIDEO_SIZE);
        }
        this.browser = browser;
        // 访问钱包扩展并解锁
        await page.goto(this.extension.home);
        await page.waitForTimeout(5000);
        await (0, unlockWallet_1.unlockWallet)(page);
        // 采集 AlphaRadar 数据
        (0, log_1.log)("Starting AlphaRadar data collection...");
        const result = await (0, AlphaRadar_1.scrape)(page);
        // 解析项目数据
        try {
            this.collectedProjects = JSON.parse(result.htmlContent);
            (0, log_1.log)(`Collected ${this.collectedProjects.length} projects from AlphaRadar`);
        }
        catch (e) {
            (0, log_1.log)("Failed to parse collected data");
            this.collectedProjects = [];
        }
        this.setReady(true);
    }
    /**
     * 验证项目并生成报告
     */
    async validateAndGenerateReport() {
        if (this.collectedProjects.length === 0) {
            return "No projects collected";
        }
        (0, log_1.log)("Validating projects with KOL data...");
        // 验证 KOL 数据
        const validatedProjects = await (0, report_1.validateProjectsWithKOL)(this.collectedProjects);
        // 生成报告
        const report = (0, report_1.generateReport)(validatedProjects);
        // 保存报告
        const reportPath = (0, report_1.saveReport)(report);
        // 同时输出到控制台
        console.log("\n" + "=".repeat(60));
        console.log(report);
        console.log("=".repeat(60) + "\n");
        return report;
    }
    async stop() {
        await this.registry.stopAll();
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    getMetrics() {
        return {
            name: "scraper",
            value: this.registry.exportMetrics(),
        };
    }
    getMetricsValue() {
        return this.registry.exportMetricsValue();
    }
    getCollectedProjects() {
        return this.collectedProjects;
    }
}
exports.ScraperCollector = ScraperCollector;
//# sourceMappingURL=index.js.map