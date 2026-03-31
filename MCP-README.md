# AlphaResearch MCP Server

让 Claude Code 直接调用 AlphaResearch 采集 AlphaRadar 项目信息。

## 安装

### 1. 克隆仓库

```bash
git clone https://github.com/ynbtc/alpharesearch.git
cd alpharesearch
npm install
```

### 2. 配置 Claude Code MCP

在 Claude Code 配置文件中添加：

```json
{
  "mcpServers": {
    "alpharesearch": {
      "command": "node",
      "args": ["dist/mcp.js"],
      "cwd": "/path/to/alpharesearch",
      "env": {
        "FRONTRUN_API_KEY": "3mJXkDFc6e9ijbj2TgOZhX8U006PUk7W"
      }
    }
  }
}
```

配置文件位置：
- macOS: `~/Library/Application Support/Claude/settings.json`
- Linux: `~/.config/claude/settings.json`

### 3. 重启 Claude Code

```bash
claude
```

## 使用方法

在 Claude Code 中自然语言调用：

```
帮我采集 AlphaRadar 上的早期项目
```

```
验证 @Surgexyz_ 的 KOL 关注数
```

```
生成项目研究报告
```

## 可用工具

| 工具 | 功能 |
|------|------|
| `collect_alpharadar_projects` | 采集 AlphaRadar 项目 |
| `verify_kol_followers` | 验证 KOL 关注数 |
| `generate_project_report` | 生成研究报告 |

## 示例对话

**你**: "帮我找 AlphaRadar 上的高质量项目"

**Claude Code**: 
> 我来帮你采集 AlphaRadar 项目并验证 KOL 质量。

[调用 collect_alpharadar_projects]
[调用 verify_kol_followers 逐个验证]
[调用 generate_project_report 生成报告]

**结果**:
```
📊 项目研究报告

1、项目名称：Surgexyz_
项目推特：https://x.com/Surgexyz_
项目介绍：高质量项目，社区活跃度高
AlphaRadar评分: 85
KOL关注数：133⭐️

2、项目名称：fair_vc
项目推特：https://x.com/fair_vc
项目介绍：新兴项目，具有一定潜力
AlphaRadar评分: 72
KOL关注数：93⭐️
```

## 完整工作流

```
Claude Code
    ↓ 自然语言指令
MCP Server (alpharesearch)
    ↓ 调用工具
AlphaRadar 采集
    ↓ 获取项目列表
Frontrun.pro API
    ↓ 验证 KOL 关注数
生成报告
    ↓ 返回 Claude Code
展示结果
```

## 配置说明

| 环境变量 | 说明 |
|---------|------|
| `FRONTRUN_API_KEY` | Frontrun.pro API 密钥 |
| `ALPHARADAR_URL` | AlphaRadar 地址 |
| `OKX_WALLET_PASSWORD` | OKX 钱包密码 |

## 故障排除

**问题**: MCP Server 无法启动
**解决**: 检查 node 版本 >= 18

**问题**: Frontrun API 返回 401
**解决**: 检查 FRONTRUN_API_KEY 是否正确

**问题**: AlphaRadar 采集失败
**解决**: 确保已解压 extension.zip

## 许可证

MIT
