# Agent 测试网站（Vercel Serverless）

这是一个用于**规划并快速落地** Agent 能力测试网站的最小可运行实现，覆盖：

- 多格式文件 IO 测试
- Web UI 交互测试
- 安全性测试
- MCP / Skill 访问与能力声明

## 技术方案

- 前端：Next.js App Router
- 后端：Next.js Serverless API Routes
- 部署：Vercel（零运维）

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

## 后续扩展建议

1. 增加上传接口（S3/R2）并对文件类型进行策略化扫描。  
2. 引入任务编排（队列）执行长耗时测试，并输出评分报告。  
3. 对接可观测栈（OpenTelemetry + Log Drains）记录 Agent 行为链路。
