import { chromium, type BrowserContext } from "playwright";
import { join } from "path";
import AbstractCollector from "../AbstractCollector";
import { Metrics, MetricsValue } from "../../types/Metrics";
import { USER_DATA_PATH, EXTENSIONS_PATH, VIDEO_SIZE, REPORT_PATH } from "../../config";
import { MetricsRegistry } from "../../registry/MetricsRegistry";
import { log } from "../../utils/log";
import { Extension } from "../../types/Extension";
import { setExtensionData } from "../../lib/unzipExtension";
import { PageCollector } from "./PageCollector";
import { unlockWallet } from "./unlockWallet";

export class ScraperCollector extends AbstractCollector {
  private readonly registry = new MetricsRegistry();
  private browser: BrowserContext | null = null;

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

    if(this.headless) options.recordVideo = {
      dir: REPORT_PATH,
      size: VIDEO_SIZE
    };

    const browser = await chromium.launchPersistentContext(USER_DATA_PATH, options);
    const page = await browser.newPage();
    if(this.headless) await page.setViewportSize(VIDEO_SIZE);
    this.browser = browser;
    await page.goto(this.extension.home);

    await page.waitForTimeout(5000);

    await unlockWallet(page);

    const pageCollector = new PageCollector(
      this.extension,
      browser
    );
    await this.registry.register(pageCollector);

    this.setReady(true);
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
}
