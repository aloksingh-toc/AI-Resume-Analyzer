import { statusColor } from '../../theme'

export default function JdMatchPanel({ jdMatchScore }) {
  if (jdMatchScore == null) return null
  const color = statusColor(jdMatchScore)
  const tip = jdMatchScore >= 70 ? '🔥 Strong match — apply with confidence'
    : jdMatchScore >= 45 ? '📊 Moderate match — add missing keywords below'
    : '🎯 Low match — tailor your resume to this JD'

  return (
    <div className="glass-card" style={{ padding: '18px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ fontSize: '48px', fontWeight: '900', color, lineHeight: 1 }}>{jdMatchScore}%</span>
        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>JD Match</span>
      </div>
      <div style={{ flex: 1, minWidth: '100px' }}>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', width: `${jdMatchScore}%`, background: color, borderRadius: '999px', transition: 'width 1.2s ease', boxShadow: `0 0 8px ${color}40` }} />
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>{tip}</span>
      </div>
    </div>
  )
}
