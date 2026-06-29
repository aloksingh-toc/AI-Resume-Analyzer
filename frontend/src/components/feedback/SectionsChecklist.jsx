export default function SectionsChecklist({ missingSections }) {
  const missing = missingSections || []

  if (missing.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '18px', marginBottom: '14px' }}>
        <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Resume Sections</span>
        <p style={{ fontSize: '13px', color: '#4ade80' }}>✅ All essential sections present</p>
      </div>
    )
  }

  return (
    <div className="glass-card" style={{ padding: '18px', marginBottom: '14px' }}>
      <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Missing Sections</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px' }}>
        {missing.map(sec => (
          <div key={sec} style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 10px',
            borderRadius: '8px', fontSize: '12px', fontWeight: '500',
            background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <span style={{ fontWeight: '800', fontSize: '13px' }}>✗</span> {sec}
          </div>
        ))}
      </div>
    </div>
  )
}
