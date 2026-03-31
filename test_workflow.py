#!/usr/bin/env python3
"""
测试 Frontrun API 和报告生成
"""

import requests
from datetime import datetime

FRONTRUN_API_KEY = "3mJXkDFc6e9ijbj2TgOZhX8U006PUk7W"

# 模拟 AlphaRadar 采集的项目
test_projects = [
    {"name": "Surgexyz_", "twitter_username": "Surgexyz_", "score": "85"},
    {"name": "fair_vc", "twitter_username": "fair_vc", "score": "78"},
    {"name": "24_Hours_Art", "twitter_username": "24_Hours_Art", "score": "72"},
    {"name": "test_low", "twitter_username": "test_low_followers", "score": "60"},
]


def get_kol_followers(username):
    """获取 KOL 关注数"""
    url = f"https://api.frontrun.pro/api/v1/pro/twitter/{username}/smart-followers/count"
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
            return data.get('data', {}).get('totalCount')
        return None
    except Exception as e:
        print(f"  错误: {e}")
        return None


def generate_report(projects):
    """生成报告"""
    today = datetime.now().strftime('%Y-%m-%d')
    
    lines = [
        f"📊 今日热门项目 ({today})",
        f"筛选条件: KOL关注数 ≥ 3",
        f"共计: {len(projects)} 个项目\n"
    ]
    
    for i, p in enumerate(projects, 1):
        lines.extend([
            f"{i}、项目名称：{p['name']}",
            f"项目推特：https://x.com/{p['twitter_username']}",
            f"项目介绍：高质量项目，社区活跃度高",
            f"AlphaRadar评分: {p['score']}",
            f"KOL关注数：{p['kol_followers']}⭐️",
            ""
        ])
    
    return '\n'.join(lines)


def main():
    print("="*60)
    print("测试 Frontrun API 工作流")
    print("="*60)
    
    filtered = []
    
    for project in test_projects:
        username = project['twitter_username']
        print(f"\n检查 @{username}...", end=' ')
        
        kol = get_kol_followers(username)
        if kol is not None:
            print(f"KOL: {kol}", end=' ')
            if kol >= 3:
                project['kol_followers'] = kol
                filtered.append(project)
                print("✅")
            else:
                print("❌")
        else:
            print("⚠️ 失败")
    
    # 排序
    filtered.sort(key=lambda x: x.get('kol_followers', 0), reverse=True)
    
    # 生成报告
    print("\n" + "="*60)
    report = generate_report(filtered)
    print(report)
    print("="*60)
    
    print(f"\n✅ 测试完成！通过 {len(filtered)}/{len(test_projects)} 个项目")


if __name__ == '__main__':
    main()
