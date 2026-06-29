const steps = [
  { num: '01', title: 'Upload Your Resume',      color: '#6366f1', desc: 'Drop your PDF resume. Optionally paste a job description for keyword match scoring.' },
  { num: '02', title: 'AI Scores Every Section', color: '#8b5cf6', desc: 'Our AI reviews summary, skills, experience, formatting, and ATS compatibility in seconds.' },
  { num: '03', title: 'Fix & Land Interviews',   color: '#3b82f6', desc: 'Get specific, actionable feedback on missing keywords, weak areas, and quick wins.' },
]

export default function HowItWorks() {
  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#64748b', marginBottom: '20px' }}>HOW IT WORKS</p>
      <div className="hiw-grid">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="glass-card"
            style={{ padding: '28px 24px', textAlign: 'left', position: 'relative', transition: 'all 0.3s ease' }}
          >
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: `${s.color}15`, border: `1px solid ${s.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: s.color }}>{s.num}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', top: '44px', right: '-10px',
                width: '20px', height: '2px',
                background: `linear-gradient(90deg, ${s.color}40, transparent)`,
                zIndex: 1,
              }} className="hiw-connector" />
            )}
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>{s.title}</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.65' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
