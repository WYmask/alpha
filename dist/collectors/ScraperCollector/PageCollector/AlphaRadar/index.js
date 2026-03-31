"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const url = 'https://alpharadar.io/twitter';
async function extractProjects(page) {
    // 等待表格加载
    await page.waitForSelector('table tbody tr', { timeout: 30000 });
    // 提取所有项目数据
    const projects = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        const data = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const nameCell = cells[0];
                const nameText = nameCell.textContent?.trim() || '';
                const nameParts = nameText.split('\n').map(s => s.trim()).filter(s => s);
                const projectName = nameParts[0] || '';
                const twitterHandle = nameParts[1] || '';
                // 提取 Twitter 链接
                const twitterLink = nameCell.querySelector('a[href*="x.com"], a[href*="twitter.com"]');
                const twitterUrl = twitterLink?.getAttribute('href') || `https://x.com/${twitterHandle.replace('@', '')}`;
                data.push({
                    name: projectName,
                    twitterHandle: twitterHandle,
                    twitterUrl: twitterUrl,
                    time: cells[1]?.textContent?.trim() || '',
                    score: cells[2]?.textContent?.trim() || '',
                    followers: cells[3]?.textContent?.trim() || '',
                    status: cells[4]?.textContent?.trim() || '',
                    type: cells[5]?.textContent?.trim() || '',
                    category: cells[6]?.textContent?.trim() || '',
                });
            }
        });
        return data;
    });
    return projects;
}
async function navigateToNextPage(page) {
    try {
        const nextBtn = await page.$('button.ant-pagination-next:not([disabled])');
        if (!nextBtn)
            return false;
        await nextBtn.click();
        await page.waitForTimeout(3000);
        return true;
    }
    catch {
        return false;
    }
}
const scrape = async (page) => {
    await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
    });
    await page.waitForTimeout(5000);
    // 采集所有分页数据
    const allProjects = [];
    const seen = new Set();
    for (let pageNum = 1; pageNum <= 50; pageNum++) {
        console.log(`[*] 采集第 ${pageNum} 页...`);
        const projects = await extractProjects(page);
        for (const project of projects) {
            const key = `${project.name}_${project.twitterHandle}`;
            if (!seen.has(key) && project.name) {
                seen.add(key);
                allProjects.push(project);
            }
        }
        // 尝试翻页
        const hasNext = await navigateToNextPage(page);
        if (!hasNext)
            break;
    }
    console.log(`[*] 共采集 ${allProjects.length} 个项目`);
    await page.close();
    return {
        htmlContent: JSON.stringify(allProjects, null, 2),
        projects: allProjects
    };
};
exports.scrape = scrape;
//# sourceMappingURL=index.js.map