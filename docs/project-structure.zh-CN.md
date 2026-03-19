# 项目结构说明

## 一句话理解

这个仓库现在可以拆成四层：

1. `app/`：Next.js 路由层，负责首页、Live 场景页、Runs 页、报告页和 API 路由。
2. `components/`：可复用前端组件层，目前主要是 Phaser 画布挂载组件。
3. `lib/`：共享数据、类型、环境变量和持久化配置层。
4. `public/star-office/`：授权像素素材与 Phaser 运行时资源。

它不是单纯的静态网站，也不是纯游戏项目，而是：

- Next.js 负责网站壳子、页面和接口
- Phaser 负责 `/live` 的像素办公室场景
- 共享数据层负责测试域、用例、fixtures 和 demo runs
- 后续 Supabase 会接在持久化层

## 当前页面分工

### `/`

- 角色：Landing Page
- 作用：解释平台目标、核心能力和页面入口
- 技术：React Client Component + 中英文 / light-dark 切换

### `/live`

- 角色：原版优先的像素办公室场景页
- 作用：展示 Phaser 地图、当前区域状态、开始测试和查看报告入口
- 技术：
  - 页面外壳：Next.js
  - 场景渲染：`components/live/phaser-office-canvas.tsx`
  - 资源：`public/star-office/*`

### `/runs`

- 角色：任务列表与最小运行入口
- 作用：查看 demo runs，创建内存原型任务
- 技术：前端页面 + `/api/runs`

### `/runs/[id]`

- 角色：任务详情页
- 作用：查看单条 run 的输入、输出、状态、notes 和 fixtures

### `/reports/[id]`

- 角色：独立评估报告页
- 作用：把单次运行结果沉淀成完整报告，而不是混在 live 页面里

## 目录拆解

### `app/`

- `app/page.tsx`
  - 首页 / Landing Page
- `app/live/page.tsx`
  - 原版优先的 live 页面外壳
- `app/runs/page.tsx`
  - runs 列表与创建表单
- `app/runs/[id]/page.tsx`
  - run detail
- `app/reports/[id]/page.tsx`
  - report detail
- `app/api/*`
  - Serverless API 路由
- `app/globals.css`
  - 全局样式，包括首页、runs、report、live 及像素风控制区样式

### `components/`

- `components/live/phaser-office-canvas.tsx`
  - Phaser 挂载入口
  - 负责加载 spritesheet、创建动画、渲染办公室场景
  - React 只负责传入状态，Phaser 负责场景表现

### `lib/`

- `lib/benchmark-types.ts`
  - 测试域、用例、run record 等类型定义
- `lib/site-data.ts`
  - 当前 demo 数据中心
  - 包含模块、roadmap、fixtures、test cases、run records
- `lib/env.ts`
  - 环境变量读取
- `lib/supabase-config.ts`
  - 持久化模式摘要，给后续 Supabase 接入做准备

### `public/star-office/`

- 授权像素素材
- `phaser.min.js`
  - 本地 Phaser 运行时
- `office_bg_small.webp`
  - 场景底图
- `star-idle-v5.png`
  - 主角色 idle spritesheet
- `star-working-spritesheet-grid.webp`
  - 工作状态 spritesheet
- `serverroom-spritesheet.webp`
  - 服务器动画
- `coffee-machine-v3-grid.webp`
  - 咖啡机动画
- `error-bug-spritesheet-grid.webp`
  - bug 动画
- `sync-animation-v3-grid.webp`
  - 同步动画
- `memo-bg.webp`
  - 备忘录背景

### `scripts/`

- `scripts/split-spritesheet.sh`
  - 用于切 spritesheet 帧图的辅助脚本

## 数据流怎么理解

当前版本的数据流是：

1. `lib/site-data.ts` 提供 demo 测试数据。
2. `app/api/*` 把这些数据包装成接口输出。
3. 页面从 API 或共享数据读取状态。
4. `/live` 页面把状态映射成 Phaser 场景表现。
5. `/reports/[id]` 把 run 数据整理成独立报告。

现在还没有真正的数据库，所以 `runs` 仍然是内存原型。

## 为什么现在看起来像“两套前端”

因为它本来就是两种 UI 模式：

1. 常规网站页面
   - 首页
   - runs
   - reports

2. Phaser 场景页面
   - live

这是刻意的，不是结构混乱。
`/live` 追求原版像素场景表现；其他页面追求正常产品信息架构。

## 接下来最合理的演进

### 近一步

- 把更多原版场景内 UI 迁进 Phaser
- 让 `/live` 更少依赖 React DOM 外壳

### 再下一步

- 用 Supabase 替换 `lib/site-data.ts` 里的内存 runs
- 保留 `site-data` 作为 fixture/demo fallback

### 报告层

- 给 `/reports/[id]` 接真实评分明细
- 不再用 demo 推导 rubric 分数

## 推荐阅读顺序

如果你第一次看这个仓库，建议按下面顺序读：

1. `README.md`
2. `docs/project-structure.zh-CN.md`
3. `app/page.tsx`
4. `app/live/page.tsx`
5. `components/live/phaser-office-canvas.tsx`
6. `lib/site-data.ts`
7. `app/api/runs/route.ts`
