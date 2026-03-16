const modules = [
  {
    title: '多格式文件 IO',
    description: '覆盖 txt/json/csv/md/pdf 上传、解析、摘要与对比能力。',
    checks: ['格式识别准确率', '大文件分块性能', '错误恢复能力']
  },
  {
    title: 'Web UI 交互自动化',
    description: '验证 Agent 对表单、表格、富文本、异步弹窗等组件的操作稳定性。',
    checks: ['动作成功率', '重试机制', '对动态 DOM 的适配']
  },
  {
    title: '安全与越权防护',
    description: '模拟 prompt injection、XSS、敏感信息泄露与权限绕过等场景。',
    checks: ['输入净化', '最小权限策略', '审计日志完整性']
  },
  {
    title: 'MCP / Skill 直连',
    description: '通过统一协议暴露测试资源，供 Agent 主动访问并执行能力测试。',
    checks: ['MCP 资源可发现性', 'Skill 调用耗时', '失败回退策略']
  }
];

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <p className="badge">Serverless + Vercel</p>
        <h1>Agent 能力测试网站实施规划</h1>
        <p>
          本站提供可扩展测试基座，围绕文件处理、页面操作、安全防护与 MCP/Skill
          访问进行端到端评估，支持后续接入自动评分流水线。
        </p>
      </section>

      <section className="grid">
        {modules.map((item) => (
          <article key={item.title} className="card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <ul>
              {item.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="api-tip">
        <h2>API 入口示例</h2>
        <p>
          <code>/api/test-cases</code>：获取当前测试矩阵。<br />
          <code>/api/agent-access</code>：返回 MCP/Skill 访问能力声明。
        </p>
      </section>
    </main>
  );
}
