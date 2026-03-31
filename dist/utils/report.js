"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
exports.validateProjectsWithKOL = validateProjectsWithKOL;
exports.saveReport = saveReport;
const frontrun_1 = require("./frontrun");
/**
 * 生成 AlphaRadar 项目研究报告
 * @param projects 项目列表
 * @param date 报告日期
 * @returns 格式化的报告文本
 */
function generateReport(projects, date = new Date().toISOString().split('T')[0]) {
    // 筛选有 KOL 关注的项目（≥3）
    const qualifiedProjects = projects
        .filter(p => (p.kolFollowers || 0) >= 3)
        .sort((a, b) => (b.kolFollowers || 0) - (a.kolFollowers || 0))
        .slice(0, 20); // 取前20个
    if (qualifiedProjects.length === 0) {
        return `📊 今日热门项目 (${date})\n\n暂无符合条件的项目（KOL关注数 ≥ 3）`;
    }
    let report = `📊 今日热门项目 (${date})\n\n`;
    qualifiedProjects.forEach((project, index) => {
        const rank = index + 1;
        const description = generateDescription(project);
        const stars = '⭐️'.repeat(Math.min(Math.ceil((project.kolFollowers || 0) / 30), 5));
        report += `${rank}、项目名称：${project.name}\n`;
        report += `项目推特：${project.twitterUrl}\n`;
        report += `项目介绍：${description}\n`;
        report += `KOL关注数：${project.kolFollowers}${stars}\n\n`;
    });
    return report.trim();
}
/**
 * 根据项目信息生成描述
 */
function generateDescription(project) {
    // 如果有原始描述，使用原始描述
    if (project.description && project.description.length > 10) {
        return project.description;
    }
    // 根据类型和分类生成描述
    const typeMap = {
        'AI': 'AI 驱动的',
        'DeFi': '去中心化金融',
        'NFT': 'NFT 生态',
        'GameFi': '游戏金融',
        'SocialFi': '社交金融',
        'Infrastructure': '基础设施',
    };
    const category = project.category || 'Web3';
    const type = typeMap[project.type] || project.type || '创新';
    // 生成描述
    const descriptions = [
        `专注${category}领域的${type}项目`,
        `${type}解决方案，致力于${category}创新`,
        `下一代${category}平台，融合${type}技术`,
        `基于${type}的${category}生态系统`,
        `${category}赛道的${type}基础设施`,
    ];
    // 根据项目名称哈希选择描述
    const hash = project.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return descriptions[hash % descriptions.length];
}
/**
 * 验证项目并获取 KOL 数据
 * @param projects 项目列表
 * @returns 验证后的项目列表
 */
async function validateProjectsWithKOL(projects) {
    console.log(`[*] 开始验证 ${projects.length} 个项目的 KOL 数据...`);
    const validatedProjects = [];
    for (const project of projects) {
        const kolCount = await (0, frontrun_1.getKOLFollowers)(project.twitterHandle);
        if (kolCount !== null && kolCount >= 3) {
            validatedProjects.push({
                ...project,
                kolFollowers: kolCount
            });
            console.log(`[✓] ${project.name}: ${kolCount} KOL 关注`);
        }
        else if (kolCount !== null) {
            console.log(`[✗] ${project.name}: ${kolCount} KOL 关注（< 3，跳过）`);
        }
        else {
            console.log(`[✗] ${project.name}: API 查询失败`);
        }
        // 延迟避免限流
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log(`[*] 验证完成：${validatedProjects.length}/${projects.length} 个项目符合条件`);
    return validatedProjects;
}
/**
 * 保存报告到文件
 */
function saveReport(report, filename) {
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const date = new Date().toISOString().split('T')[0];
    const outputFile = filename || `alpha_report_${date}.txt`;
    const outputPath = path.join(outputDir, outputFile);
    fs.writeFileSync(outputPath, report, 'utf-8');
    console.log(`[*] 报告已保存: ${outputPath}`);
    return outputPath;
}
//# sourceMappingURL=report.js.map