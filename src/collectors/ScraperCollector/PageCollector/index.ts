import { type BrowserContext } from 'playwright';

import AbstractCollector from '../../AbstractCollector';
import {
  Metrics,
  MetricsValue,
  ScrapeMetricsValue,
} from '../../../types/Metrics';
import { Extension } from '../../../types/Extension';
import { loadModule } from '../../../utils/loader';
import { VIDEO_SIZE } from '../../../config';

export class PageCollector extends AbstractCollector {
  private readonly value: ScrapeMetricsValue = {
    htmlContent: '',
  };

  constructor(
    private readonly extension: Extension,
    private readonly browser: BrowserContext,
  ) {
    super();
    this.extension = extension;
    this.browser = browser;
  }

  async start(): Promise<void> {
    const mod = await loadModule(__dirname, this.extension.type);
    const page = await this.browser.newPage();
    await page.setViewportSize(VIDEO_SIZE);
    const { htmlContent } = await mod.scrape(page);

    this.value.htmlContent = htmlContent;
    this.setReady(true);
  }

  getHtmlContent(): string {
    return this.value.htmlContent;
  }

  getMetrics(): Metrics {
    return {
      name: 'scrape',
      value: this.value,
    };
  }

  getMetricsValue(): MetricsValue {
    return this.value;
  }
}
