#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const commander_1 = require("commander");
const path_1 = require("path");
const config_1 = require("./config");
const log_1 = require("./utils/log");
const fs_1 = require("./utils/fs");
async function runWrapped(headless) {
    const { extensionId, type } = config_1.EXTENSIONS[0];
    (0, log_1.log)(`Start scraping ${type} ...`);
    const scrapeTask = (0, path_1.resolve)(__dirname, "./task/scrape.js");
    cross_spawn_1.default.sync("npx", ["node", scrapeTask, extensionId, `${headless}`], {
        stdio: ["inherit", "inherit", "inherit"],
    });
    (0, log_1.log)(`Scrape ${type} end`);
}
async function collectTask(options) {
    if (options.remove === true) {
        await (0, fs_1.removeDirectoryContents)(config_1.BROWSER_PATH);
        await (0, fs_1.removeDirectoryContents)(config_1.REPORT_PATH);
    }
    await runWrapped(options.headless);
    if (options.timer) {
        const interval = parseFloat(options.interval) * config_1.TASK_INTERVAL || config_1.TASK_INTERVAL;
        setInterval(async () => {
            await runWrapped(options.headless);
        }, interval);
    }
}
(async () => {
    const program = new commander_1.Command();
    program
        .name("scraper")
        .description("Scrape alpharadar.io data")
        .version("1.0.0");
    program
        .command("run-task")
        .description("run task")
        .argument("<taskName>", "task name")
        .option("-i, --interval <number>", "Task interval in hours", "1")
        .option("-t, --timer <boolean>", "Enable scheduled execution using the specified interval", false)
        .option("-r, --remove <boolean>", "Delete browser user data directory before execution", true)
        .option("-l, --headless <boolean>", "headless status such as true, false", "true")
        .action(async (_, options) => {
        await collectTask(options);
    });
    program.parse();
})();
//# sourceMappingURL=index.js.map