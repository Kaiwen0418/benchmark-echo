# Agent 测试网站（Vercel Serverless）

这是一个用于规划并快速落地 Agent 能力评测的可运行原型，覆盖：

- 多格式文件 IO 测试（上传 + 基础解析）
- Web UI 交互测试（场景模拟）
- 安全性测试（注入/XSS/密钥外泄规则检测）
- MCP / Skill 访问（资源发现 + 能力声明）

## 技术方案

- 前端：Next.js App Router（交互式控制台）
- 后端：Next.js Serverless API Routes
- 部署：Vercel（Serverless）

## 本地运行

```bash
npm install
npm run dev
```

## 构建检查

```bash
npm run typecheck
npm run build
```

## API

- `GET /api/test-cases`：获取测试域矩阵
- `GET /api/agent-access`：获取 MCP / Skill 支持声明
- `GET /api/mcp-resources`：MCP 资源发现入口
- `POST /api/file-io`：上传并解析 `txt/md/json/csv`
- `POST /api/security-check`：安全风险规则检测
- `POST /api/ui-simulate`：返回 UI 场景动作与期望

## 交互式控制台

首页提供测试控制台，支持：

1. 上传文本类文件并查看解析统计/预览
2. 输入可疑 prompt 并获取风险判定
3. 选择 UI 场景并查看预设动作链
4. 直接拉取 MCP/Skill manifest

## 后续扩展建议

1. 对接对象存储（S3/R2）与异步任务队列，支持超大文件与批量评测。
2. 引入真实浏览器回放（Playwright）并沉淀 pass/fail 证据。
3. 增加鉴权、租户隔离、审计日志与评分报表导出。
