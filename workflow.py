#!/usr/bin/env python3
"""
AlphaRadar 完整工作流
1. 采集 AlphaRadar 项目
2. Frontrun.pro API 验证 KOL 关注数
3. 生成项目研究报告
"""

import json
import re
import requests
import subprocess
import sys
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

# API 配置
FRONTRUN_API_KEY = "3mJXkDFc6e9ijbj2TgOZhX8U006PUk7W"
FRONTRUN_BASE_URL = "https://api.frontrun.pro/api/v1/pro"
MIN_KOL_FOLLOWERS = 3


def run_alpharadar_scraper() -> str:
    """运行 AlphaRadar 采集器"""
    print("[*] 启动 AlphaRadar 采集...")
    
    try:
        result = subprocess.run(
            ["npm", "run", "prod"],
            cwd="/tmp/alpharesearch",
            capture_output=True,
            text=True,
            timeout=120
        )
        
        # 从输出中提取 HTML 或 JSON 数据
        output = result.stdout + result.stderr
        
        # 查找输出文件
        output_files = list(Path("/tmp/alpharesearch").glob("output/*.json"))
        if output_files:
            latest = max(output_files, key=lambda p: p.stat().st_mtime)
            with open(latest) as f:
                return f.read()
        
        return output
    except Exception as e:
        print(f"[!] 采集失败: {e}")
        return ""


def extract_twitter_username(url: str) -> Optional[str]:
    """从推特链接提取用户名"""
    patterns = [
        r'x\.com/([^/\s?]+)',
        r'twitter\.com/([^/\s?]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_kol_followers(twitter_username: str) -> Optional[int]:
    """调用 Frontrun.pro API 获取 KOL 关注数"""
    if not twitter_username:
        return None
    
    username = twitter_username.lstrip('@')
    url = f"{FRONTRUN_BASE_URL}/twitter/{username}/smart-followers/count"
    
    headers = {
        'accept': 'application/json',
        'X-Copilot-Client-Language': 'ZH_CN',
        'X-Copilot-Client-Platform': 'CHROME_EXTENSION',
        'X-Copilot-Client-Version': '1.0.0',
        'Authorization': f'Bearer {FRONTRUN_API_KEY}'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get('count') or data.get('data', {}).get('count')
        else:
            print(f"  [!] API 错误: {response.status_code}")
            return None
    except Exception as e:
        print(f"  [!] 请求失败: {e}")
        return None


def parse_projects_from_html(html_content: str) -> List[Dict]:
    """解析 HTML 提取项目信息"""
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("[*] 安装 BeautifulSoup...")
        subprocess.run([sys.executable, "-m", "pip", "install", "beautifulsoup4", "-q"])
        from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html_content, 'html.parser')
    projects = []
    
    rows = soup.select('table tbody tr')
    
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 4:
            continue
        
        try:
            name_cell = cells[0]
            name_text = name_cell.get_text(separator='\n', strip=True)
            name = name_text.split('\n')[0] if '\n' in name_text else name_text[:30]
            
            twitter_link = None
            for a in name_cell.find_all('a'):
                href = a.get('href', '')
                if 'x.com' in href or 'twitter.com' in href:
                    twitter_link = href
                    break
            
            if not twitter_link:
                continue
            
            twitter_username = extract_twitter_username(twitter_link)
            
            projects.append({
                'name': name,
                'twitter_url': twitter_link,
                'twitter_username': twitter_username,
                'time': cells[2].get_text(strip=True) if len(cells) > 2 else '',
                'score': cells[3].get_text(strip=True) if len(cells) > 3 else '',
                'followers': cells[4].get_text(strip=True) if len(cells) > 4 else '',
            })
        except Exception as e:
            continue
    
    return projects


def filter_projects_by_kol(projects: List[Dict]) -> List[Dict]:
    """通过 Frontrun API 过滤项目"""
    filtered = []
    
    print(f"\n[*] 开始验证 {len(projects)} 个项目的 KOL 关注数...")
    print(f"[*] 阈值: KOL ≥ {MIN_KOL_FOLLOWERS}\n")
    
    for i, project in enumerate(projects, 1):
        username = project.get('twitter_username')
        if not username:
            continue
        
        print(f"  [{i}/{len(projects)}] @{username}...", end=' ', flush=True)
        
        kol_count = get_kol_followers(username)
        
        if kol_count is not None:
            print(f"KOL: {kol_count}", end=' ')
            
            if kol_count >= MIN_KOL_FOLLOWERS:
                project['kol_followers'] = kol_count
                filtered.append(project)
                print(f"✅")
            else:
                print(f"❌")
        else:
            print(f"⚠️ 失败")
    
    return filtered


def generate_description(project: Dict) -> str:
    """生成项目介绍"""
    score = project.get('score', '')
    
    try:
        score_num = int(score) if score else 0
        if score_num >= 80:
            return "高质量项目，社区活跃度高，值得关注"
        elif score_num >= 60:
            return "新兴项目，具有一定潜力，建议观察"
        elif score_num >= 40:
            return "早期项目，创新概念，风险与机会并存"
        else:
            return "新项目，处于早期阶段，需谨慎评估"
    except:
        return "Web3 创新项目"


def generate_report(projects: List[Dict]) -> str:
    """生成项目研究报告"""
    today = datetime.now().strftime('%Y-%m-%d')
    
    report_lines = [
        f"📊 今日热门项目 ({today})",
        f"筛选条件: AlphaRadar 评分 + KOL关注数 ≥ {MIN_KOL_FOLLOWERS}",
        f"共计: {len(projects)} 个项目\n"
    ]
    
    sorted_projects = sorted(
        projects, 
        key=lambda x: x.get('kol_followers', 0), 
        reverse=True
    )
    
    for i, project in enumerate(sorted_projects, 1):
        name = project.get('name', 'Unknown')
        twitter_url = project.get('twitter_url', '')
        twitter_username = project.get('twitter_username', '')
        kol_followers = project.get('kol_followers', 0)
        score = project.get('score', 'N/A')
        description = generate_description(project)
        
        report_lines.extend([
            f"{i}、项目名称：{name}",
            f"项目推特：{twitter_url}",
            f"项目介绍：{description}",
            f"AlphaRadar评分: {score}",
            f"KOL关注数：{kol_followers}⭐️",
            ""
        ])
    
    return '\n'.join(report_lines)


def save_report(report: str, filename: str = None):
    """保存报告到文件"""
    if not filename:
        date_str = datetime.now().strftime('%Y%m%d')
        filename = f"alpharadar_report_{date_str}.txt"
    
    output_dir = Path("/tmp/alpharesearch/reports")
    output_dir.mkdir(exist_ok=True)
    
    output_path = output_dir / filename
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n[*] 报告已保存: {output_path}")
    return output_path


def main():
    """主工作流"""
    print("="*60)
    print("AlphaRadar 项目采集工作流")
    print("="*60)
    
    # 步骤1: 采集 AlphaRadar 数据
    print("\n[步骤1/3] 采集 AlphaRadar 项目...")
    html_content = run_alpharadar_scraper()
    
    if not html_content:
        print("[!] 采集失败，请检查 npm run prod 是否正常运行")
        return
    
    # 步骤2: 解析项目
    print("\n[步骤2/3] 解析项目信息...")
    projects = parse_projects_from_html(html_content)
    print(f"[*] 找到 {len(projects)} 个项目")
    
    if not projects:
        print("[!] 未找到项目，请检查页面结构")
        return
    
    # 步骤3: Frontrun API 验证
    print("\n[步骤3/3] Frontrun.pro API 验证...")
    filtered_projects = filter_projects_by_kol(projects)
    print(f"\n[*] 通过筛选: {len(filtered_projects)}/{len(projects)} 个项目")
    
    # 生成报告
    print("\n[*] 生成研究报告...")
    report = generate_report(filtered_projects)
    
    # 输出报告
    print("\n" + "="*60)
    print(report)
    print("="*60)
    
    # 保存报告
    save_report(report)
    
    print("\n✅ 工作流完成!")


if __name__ == '__main__':
    main()
