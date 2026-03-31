# AlphaRadar

基于 Playwright 的 AlphaRadar 数据采集工具，通过加载 OKX Wallet 浏览器扩展自动抓取页面数据，并以 JSON 格式输出采集结果，支持管道传递给其他命令进行分析。

## 环境要求

- Node.js >= 18.0.0

## 安装

```bash
npm install
```

安装时会自动执行 `postinstall`，完成以下操作：
1. 安装 Playwright Chromium 浏览器
2. 编译 TypeScript
3. 解压扩展数据

## 使用

### 采集

```bash
npm run prod
```

### 管道输出到 Claude Code

```bash
npm run prod:claude
```

## CLI 参数

```
scraper run-task <taskName>

Options:
  -i, --interval <number>   定时采集间隔，单位：小时（默认 1）
  -t, --timer <boolean>     启用定时执行（默认 false）
  -r, --remove <boolean>    执行前清理浏览器用户数据（默认 true）
  -l, --headless <boolean>  无头模式（默认 true）
```
