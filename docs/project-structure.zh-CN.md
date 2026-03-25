# 项目结构说明

## 一句话理解

这个仓库现在可以拆成四层：

1. `app/`：Next.js 路由层，负责首页、Live 场景页、Runs 页、报告页和 API 路由。
2. `public/live-office/`：导入的 live 场景静态前端。
3. `lib/`：共享数据、类型、环境变量和持久化配置层。
4. `public/office-ui/`：Next.js 页面共用的字体与 memo 贴图资源。

它不是单纯的静态网站，也不是纯游戏项目，而是：

- Next.js 负责网站壳子、页面和接口
- `/live` 通过 iframe 直接承载原版 Phaser 网页
- 共享数据层负责测试域、用例、fixtures 和 demo runs
- 后续 Supabase 会接在持久化层

## 当前页面分工

### `/`

- 角色：根入口
- 作用：把站点入口直接重定向到 `/live`
- 技术：Next.js 服务端重定向

### `/live`

- 角色：原版 Star-Office 独立界面入口
- 作用：直接加载导入的原版 Phaser 网页，不再让 React 管场景状态
- 技术：
  - 页面外壳：Next.js 极薄承载层
  - iframe 组件：`components/live/live-office-frame.tsx`
  - 真正场景：`public/live-office/index.html`
  - 场景样式：`public/live-office/live-office.css`
  - TS 源码：`live-office-src/*.ts`
  - mock / 启动逻辑产物：`public/live-office/live-office-mocks.js`
  - 多语言 / UI 辅助产物：`public/live-office/live-office-i18n.js`
  - 弹窗辅助产物：`public/live-office/live-office-modal.js`
  - 房间加载 / 生图辅助产物：`public/live-office/live-office-room-actions.js`
  - 主运行时产物：`public/live-office/live-office-runtime.js`
  - 资源：`public/live-office/static/*`
  - 本地 mock：已经从 HTML 中拆出，并改成 TS 源码 + JS 产物模式

### `/landing`

- 角色：平台说明页
- 作用：作为 live 弹窗内的说明页面，解释站点三块界面分工
- 技术：React Client Component + `zh / en / ja` 语言切换

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
  - 根入口重定向到 `/live`
- `app/live/page.tsx`
  - live 路由入口
- `components/live/live-office-frame.tsx`
  - iframe 承载组件
- `app/landing/page.tsx`
  - live 弹窗里使用的平台说明页
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

### `public/live-office/`

- `public/live-office/index.html`
  - 导入后的场景 HTML 外壳
  - 现在主要负责结构和资源引用，不再内联大块 CSS
- `public/live-office/live-office.css`
  - 从 HTML 中拆出的场景样式
- `public/live-office/live-office-mocks.js`
  - 编译后的 mock fetch 层与 demo 状态初始化
- `public/live-office/live-office-i18n.js`
  - 编译后的多语言与通用 UI 文案更新逻辑
- `public/live-office/live-office-modal.js`
  - 编译后的弹窗打开 / 关闭辅助逻辑
- `public/live-office/live-office-room-actions.js`
  - 编译后的房间加载、收藏房间、生图与背景切换逻辑
- `public/live-office/live-office-runtime.js`
  - 编译后的主场景逻辑与 Phaser 集成
- `public/live-office/static/*`
  - live 场景按钮、背景、spritesheet、字体、vendor Phaser

### `live-office-src/`

- `live-office-src/live-office-mocks.ts`
  - live mock 层的 TypeScript 源码
- `live-office-src/live-office-i18n.ts`
  - live 多语言与通用 UI 文案层的 TypeScript 源码
- `live-office-src/live-office-modal.ts`
  - live 弹窗导航辅助层的 TypeScript 源码
- `live-office-src/live-office-room-actions.ts`
  - live 房间加载、收藏房间、生图与背景切换辅助层的 TypeScript 源码
- `live-office-src/live-office-runtime.ts`
  - live 剩余主运行时与 Phaser 场景的 TypeScript 源码
- 通过 `npm run build:live-office` 编译到 `public/live-office/*.js`

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

### `public/office-ui/`

- Next.js 页面共用字体
- 弹窗页面使用的 memo 背景贴图

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
5. `components/live/live-office-frame.tsx`
6. `public/live-office/index.html`
7. `live-office-src/live-office-runtime.ts`
8. `lib/site-data.ts`
9. `app/api/runs/route.ts`
