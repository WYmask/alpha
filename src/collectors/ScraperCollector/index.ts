import { chromium, type BrowserContext, type Page } from "playwright";
import { join } from "path";
import AbstractCollector from "../AbstractCollector";
import { Metrics, MetricsValue } from "../../types/Metrics";
import { USER_DATA_PATH, EXTENSIONS_PATH, VIDEO_SIZE, REPORT_PATH } from "../../config";
import { MetricsRegistry } from "../../registry/MetricsRegistry";
import { log } from "../../utils/log";
import { Extension } from "../../types/Extension";
import { setExtensionData } from "../../lib/unzipExtension";
import { unlockWallet } from "./unlockWallet";
import { scrape as scrapeAlphaRadar } from "./PageCollector/AlphaRadar";
import { validateProjectsWithKOL, generateReport, saveReport } from "../../utils/report";

interface ProjectInfo {
  name: string;
  twitterHandle: string;
  twitterUrl: string;
  description: string;
  score: string;
  followers: string;
  time: string;
  status: string;
  type: string;
  category: string;
  kolFollowers?: number;
}

export class ScraperCollector extends AbstractCollector {
  private readonly registry = new MetricsRegistry();
  private browser: BrowserContext | null = null;
  private collectedProjects: ProjectInfo[] = [];

  constructor(
    private readonly extension: Extension,
    private readonly headless: boolean
  ) {
    super();
    this.extension = extension;
    this.headless = headless;
  }

  async start(): Promise<void> {
    if (!this.extension) {
      throw new Error("No extension installed");
    }
    
    await setExtensionData(this.extension.extensionId, this.extension.key);
    const extensionId = this.extension.extensionId;
    log(`Start scraping with extension ${extensionId}`);
    
    const dir = join(EXTENSIONS_PATH, extensionId);
    const options: any = {
      headless: this.headless,
      channel: "chromium",
      args: [
        `--load-extension=${dir}`,
        `--disable-extensions-except=${dir}`,
      ],
    };

    if(this.headless) {
      options.recordVideo = {
        dir: REPORT_PATH,
        size: VIDEO_SIZE
      };
    }

    const browser = await chromium.launchPersistentContext(USER_DATA_PATH, options);
    const page = await browser.newPage();
    
    if(this.headless) {
      await page.setViewportSize(VIDEO_SIZE);
    }
    
    this.browser = browser;
    
    // 访问钱包扩展并解锁
    await page.goto(this.extension.home);
    await page.waitForTimeout(5000);
    await unlockWallet(page);
    
    // 采集 AlphaRadar 数据
    log("Starting AlphaRadar data collection...");
    const result = await scrapeAlphaRadar(page);
    
    // 解析项目数据
    try {
      this.collectedProjects = JSON.parse(result.htmlContent);
      log(`Collected ${this.collectedProjects.length} projects from AlphaRadar`);
    } catch (e) {
      log("Failed to parse collected data");
      this.collectedProjects = [];
    }

    this.setReady(true);
  }

  /**
   * 验证项目并生成报告
   */
  async validateAndGenerateReport(): Promise<string> {
    if (this.collectedProjects.length === 0) {
      return "No projects collected";
    }

    log("Validating projects with KOL data...");
    
    // 验证 KOL 数据
    const validatedProjects = await validateProjectsWithKOL(this.collectedProjects);
    
    // 生成报告
    const report = generateReport(validatedProjects);
    
    // 保存报告
    const reportPath = saveReport(report);
    
    // 同时输出到控制台
    console.log("\n" + "=".repeat(60));
    console.log(report);
    console.log("=".repeat(60) + "\n");
    
    return report;
  }

  async stop(): Promise<void> {
    await this.registry.stopAll();
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getMetrics(): Metrics {
    return {
      name: "scraper",
      value: this.registry.exportMetrics(),
    };
  }

  getMetricsValue(): MetricsValue {
    return this.registry.exportMetricsValue();
  }

  getCollectedProjects(): ProjectInfo[] {
    return this.collectedProjects;
  }
}
