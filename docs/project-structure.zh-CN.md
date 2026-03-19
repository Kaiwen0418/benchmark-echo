# 项目结构说明

## 一句话理解

这个仓库现在可以拆成四层：

1. `app/`：Next.js 路由层，负责首页、Live 场景页、Runs 页、报告页和 API 路由。
2. `public/star-office-original/`：导入的原版 Star-Office 静态前端。
3. `lib/`：共享数据、类型、环境变量和持久化配置层。
4. `public/star-office/`：授权像素素材与手工校准阶段留下的 Phaser 资源。

它不是单纯的静态网站，也不是纯游戏项目，而是：

- Next.js 负责网站壳子、页面和接口
- `/live` 通过 iframe 直接承载原版 Phaser 网页
- 共享数据层负责测试域、用例、fixtures 和 demo runs
- 后续 Supabase 会接在持久化层

## 当前页面分工

### `/`

- 角色：Landing Page
- 作用：解释平台目标、核心能力和页面入口
- 技术：React Client Component + 中英文 / light-dark 切换

### `/live`

- 角色：原版 Star-Office 独立界面入口
- 作用：直接加载导入的原版 Phaser 网页，不再让 React 管场景状态
- 技术：
  - 页面外壳：Next.js 极薄承载层
  - 真正场景：`public/star-office-original/index.html`
  - 资源：`public/star-office-original/static/*`
  - 本地 mock：写在导入页里，用来代替原 Flask 接口

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
  - 全屏 iframe 承载层
- `app/runs/page.tsx`
  - runs 列表与创建表单
- `app/runs/[id]/page.tsx`
  - run detail
- `app/reports/[id]/page.tsx`
  - report detail
- `app/api/*`
  - Serverless API 路由
- `app/globals.css`
  - 全局样式，包括首页、runs、report 与 `/live` 承载层样式

### `public/star-office-original/`

- `public/star-office-original/index.html`
  - 直接导入的原版前端页面
  - 已把 `/static/*` 资源路径改到站内目录
  - 已补最小 fetch mock，避免依赖原 Flask 后端
- `public/star-office-original/static/*`
  - 原版按钮、guest 动画、背景、spritesheet、字体、vendor Phaser

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
- 这层现在更像“素材仓”和早期 Phaser 校准区
- 当前 `/live` 主路由不再直接消费这里的 React Phaser 组件

### `scripts/`

- `scripts/split-spritesheet.sh`
  - 用于切 spritesheet 帧图的辅助脚本

## 数据流怎么理解

当前版本的数据流是：

1. `lib/site-data.ts` 提供 demo 测试数据。
2. `app/api/*` 把这些数据包装成接口输出。
3. 页面从 API 或共享数据读取状态。
4. `/live` 直接加载导入的原版前端。
5. `/reports/[id]` 把 run 数据整理成独立报告。

现在还没有真正的数据库，所以 `runs` 仍然是内存原型。

## 为什么现在看起来像“两套前端”

因为它本来就是两种 UI 模式：

1. 常规网站页面
   - 首页
   - runs
   - reports

2. 原版 Phaser 场景页面
   - live

这是刻意的，不是结构混乱。
`/live` 追求原版导入 fidelity；其他页面追求正常产品信息架构。

## 接下来最合理的演进

### 近一步

- 继续清理导入页里的兼容 patch
- 把 mock 数据逐步替换成你自己的状态源

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
5. `public/star-office-original/index.html`
6. `lib/site-data.ts`
7. `app/api/runs/route.ts`
