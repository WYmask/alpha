import { type Page } from 'playwright';
import { ScrapeResult } from '../../../../types/Scrape';

const url = 'https://alpharadar.io/twitter';

async function extractHtmlContent(page: Page): Promise<string> {
  return page.content();
}

export const scrape = async (page: Page): Promise<ScrapeResult> => {
  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  const htmlContent = await extractHtmlContent(page);

  await page.close();

  return { htmlContent };
};
