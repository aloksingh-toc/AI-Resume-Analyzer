export default function KeywordsPanel({ keywordsFound, keywordsMissing, hasJdMatch }) {
  const hasAny = keywordsFound?.length > 0 || keywordsMissing?.length > 0
  if (!hasAny) return null

  return (
    <div className="glass-card" style={{ padding: '18px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {keywordsFound?.length > 0 && (
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            ✅ Found in Resume
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {keywordsFound.map(kw => (
              <span key={kw} style={{
                padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)',
              }}>{kw}</span>
            ))}
          </div>
        </div>
      )}
      {keywordsMissing?.length > 0 && (
        <div>
          <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            ❌ Missing{hasJdMatch ? ' (from JD)' : ' (recommended)'}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {keywordsMissing.map(kw => (
              <span key={kw} style={{
                padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)',
              }}>{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
