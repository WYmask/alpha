#!/usr/bin/env node
import spawn from "cross-spawn";
import { Command } from "commander";
import { resolve } from "path";
import { EXTENSIONS, TASK_INTERVAL, BROWSER_PATH, REPORT_PATH } from "./config";
import { log } from "./utils/log";
import { removeDirectoryContents } from "./utils/fs";
import { CmdOptions } from "./types/CmdOptions";

async function runWrapped(headless: boolean) {
  const { extensionId, type } = EXTENSIONS[0];
  log(`Start scraping ${type} ...`);
  const scrapeTask = resolve(__dirname, "./task/scrape.js");
  spawn.sync("npx", ["node", scrapeTask, extensionId, `${headless}`], {
    stdio: ["inherit", "inherit", "inherit"],
  });
  log(`Scrape ${type} end`);
}

async function collectTask(options: CmdOptions) {
  if (options.remove === true) {
    await removeDirectoryContents(BROWSER_PATH);
    await removeDirectoryContents(REPORT_PATH);
  }
  await runWrapped(options.headless);
  if (options.timer) {
    const interval =
      parseFloat(options.interval) * TASK_INTERVAL || TASK_INTERVAL;
    setInterval(async () => {
      await runWrapped(options.headless);
    }, interval);
  }
}

(async () => {
  const program = new Command();

  program
    .name("scraper")
    .description("Scrape alpharadar.io data")
    .version("1.0.0");

  program
    .command("run-task")
    .description("run task")
    .argument("<taskName>", "task name")
    .option("-i, --interval <number>", "Task interval in hours", "1")
    .option(
      "-t, --timer <boolean>",
      "Enable scheduled execution using the specified interval",
      false
    )
    .option(
      "-r, --remove <boolean>",
      "Delete browser user data directory before execution",
      true
    )
    .option(
      "-l, --headless <boolean>",
      "headless status such as true, false",
      "true"
    )
    .action(async (_: string, options: CmdOptions) => {
      await collectTask(options);
    });
  program.parse();
})();
