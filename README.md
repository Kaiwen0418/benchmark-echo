# Agent 测试网站（Vercel Serverless）

这是一个用于规划并落地 Agent 能力测试平台的最小可运行实现。当前仓库已经具备静态展示页和基础声明接口，下一步目标是把它推进成一个可执行、可评分、可审计的基准测试站点。

## 当前状态

- 已完成：Next.js App Router 基础站点
- 已完成：测试域概览首页
- 已完成：首页 light/dark 主题切换与中英文切换
- 已完成：`/api/test-cases`、`/api/agent-access`、`/api/roadmap`、`/api/fixtures`、`/api/runs` 基础接口
- 已完成：页面与 API 共用的统一静态数据源、类型定义和 fixture 清单
- 已完成：`RunRecord` 的最小原型接口与示例记录
- 已完成：`/runs` 列表页、详情页和最小任务创建表单
- 已完成：`/live` 已切为原版 Star-Office 前端导入模式，并在站内以独立静态子应用运行
- 已完成：Supabase 环境变量模板与运行时配置占位层
- 未完成：持久化存储、真实执行器、文件上传、正式评分报告、鉴权与日志链路

## 项目结构 / Project Structure

如果你想先理解“现在这个仓库到底怎么分层”，建议先看这两份文档：

- 中文：[docs/project-structure.zh-CN.md](./docs/project-structure.zh-CN.md)
- English: [docs/project-structure.en.md](./docs/project-structure.en.md)

当前可以先用一句话理解：

- `app/` 负责 Next.js 页面与 API
- `public/star-office-original/` 负责原版 Phaser 前端与静态资源
- `lib/` 负责共享类型、demo 数据和环境配置
- `public/star-office/` 负责授权像素素材

页面职责：

- `/`：Landing Page
- `/live`：直接承载原版 Phaser 像素办公室
- `/runs`：任务列表与创建入口
- `/reports/[id]`：独立评估报告

## 项目目标

平台需要回答三个核心问题：

1. Agent 能否在受控环境里稳定完成不同类型任务。
2. Agent 在失败、异常输入、恶意输入下会如何表现。
3. Agent 的能力结果是否可以被记录、复现、评分并横向对比。

围绕这三个问题，建议将平台能力拆成四个一级域：

- 文件 IO：上传、解析、抽取、比对、摘要、容错
- Web UI：表单填写、表格操作、复杂组件交互、异步等待
- 安全防护：prompt injection、越权、敏感信息泄露、XSS
- MCP / Skill：资源发现、权限声明、调用回退、链路审计

## 推荐实施路线

### Phase 1：测试基线成型

目标：先让平台具备“定义测试用例并可读取”的能力。

交付物：

- 测试矩阵 schema：领域、用例、难度、输入、期望输出、评分项
- 前端 roadmap 页面：展示阶段目标、范围与当前状态
- 静态 fixtures 清单：为文件、UI 与安全场景提供演示数据
- 统一 manifest：声明 Agent 可访问的资源、技能与限制

完成标准：

- 可以通过 API 获取完整测试域定义
- 每个一级域至少有 3 个可展示的代表性场景
- README 和首页保持一致，不再只停留在概念描述

### Phase 2：最小可执行闭环

目标：把“定义测试”推进到“能运行一次测试任务”。

交付物：

- 文件上传入口，支持 txt/json/csv/md/pdf
- 任务创建接口：提交测试用例、输入载荷与执行配置
- 任务状态接口：`queued`、`running`、`passed`、`failed`
- 结果存储：保存原始输入、Agent 输出、评分明细、错误信息

完成标准：

- 单个测试任务可以端到端执行并返回报告
- 前端可查看任务列表、详情与失败原因
- 失败结果具备可重放所需的最小上下文

### Phase 3：评分与审计系统

目标：让测试结果具有对比价值，而不是一次性演示。

交付物：

- 评分模型：成功率、耗时、重试次数、结构化输出质量、安全扣分
- 报告页面：按域、模型、版本聚合结果
- 审计日志：记录请求、资源访问、失败原因、权限拦截
- 可观测埋点：任务耗时、错误分布、接口延迟

完成标准：

- 同一测试集可对多个 Agent 或多个版本进行横向比较
- 审计日志可用于复盘异常任务
- 平台管理者可识别高失败率场景并迭代用例

### Phase 4：平台化与集成

目标：使站点可作为持续评测基础设施使用。

交付物：

- 对象存储接入：S3/R2 持久化测试文件
- 队列/异步任务：处理长耗时测试
- 权限模型：匿名浏览、受限执行、管理员操作
- 外部接入：Webhook、批量导入、CI 触发评测

完成标准：

- 长任务不会阻塞请求生命周期
- 多角色权限边界清晰
- 可以被内部工具链或 CI 直接调用

## 建议的数据模型

### `TestCase`

```ts
type TestCase = {
  id: string;
  domain: 'file-io' | 'web-ui' | 'security' | 'mcp-skill';
  title: string;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  inputSchema: Record<string, unknown>;
  expectedSignals: string[];
  scoringRubric: {
    name: string;
    weight: number;
  }[];
};
```

### `RunRecord`

```ts
type RunRecord = {
  id: string;
  testCaseId: string;
  status: 'queued' | 'running' | 'passed' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  score?: number;
  agentOutput?: string;
  evaluatorNotes?: string[];
};
```

## API 规划

当前：

- `GET /api/test-cases`：获取测试域矩阵
- `GET /api/agent-access`：获取 MCP / Skill 支持声明
- `GET /api/roadmap`：返回阶段规划与近期任务
- `GET /api/fixtures`：返回测试 fixture 清单
- `GET /api/runs`：返回运行记录列表
- `POST /api/runs`：创建最小任务记录原型
- `GET /api/runs/:id`：查询单条任务记录

下一步建议新增：

- `POST /api/uploads`：接收测试文件并返回文件元信息
- `GET /api/reports/summary`：返回聚合评分报告

## 近两轮迭代建议

### Sprint A

- 将 `runs` 从内存原型切换为 Supabase 持久化存储
- 为每个领域继续扩充样例用例，并补充输入 schema 和评分项
- 新增前端任务详情页，消费 `/api/runs` 与 `/api/runs/:id`

### Sprint B

- 接入本地或云端对象存储
- 新增任务创建与任务详情接口
- 引入最小报告页，先支持单次执行结果展示

## 风险与约束

- Vercel Serverless 不适合长时间同步任务，早期就要考虑异步化
- 文件上传后必须做类型校验与大小限制，不能只依赖前端控制
- 安全测试需要隔离设计，避免测试载荷影响真实管理接口
- 评分规则必须版本化，否则历史结果不可比

## 持久化方案

当前仓库默认保留 `memory` 模式，便于本地演示；后续生产部署以 `Supabase` 作为默认持久化方案。

建议职责拆分：

- Supabase Postgres：`runs`、`test_cases`、`fixtures` 元数据、评分结果、审计记录
- Supabase Storage：上传文件、测试报告、截图和导出物
- Vercel：前端、Serverless API、调度入口

当前已经预留了配置入口：

- 环境变量模板：`.env.example`
- 运行时环境读取：`lib/env.ts`
- 持久化模式摘要：`lib/supabase-config.ts`

## 环境变量

本地请复制 `.env.example` 到 `.env.local`，Vercel 上请在 Project Settings 里配置同名变量。

必要变量：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

推荐变量：

- `SUPABASE_JWT_SECRET`
- `SUPABASE_STORAGE_BUCKET_UPLOADS`
- `SUPABASE_STORAGE_BUCKET_REPORTS`
- `SUPABASE_STORAGE_BUCKET_FIXTURES`
- `APP_BASE_URL`
- `ENABLE_SUPABASE_PERSISTENCE`

建议环境划分：

- Development：本地 `.env.local`
- Preview：连接 Supabase preview / staging 项目
- Production：连接正式 Supabase 项目

当前开关规则：

- `ENABLE_SUPABASE_PERSISTENCE=false`：继续使用内存原型
- `ENABLE_SUPABASE_PERSISTENCE=true`：要求关键 Supabase 变量齐全，后续可无缝切到真实持久化实现

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
