import { statusColor } from '../../theme'

export default function AtsPanel({ atsScore, atsIssues }) {
  if (atsScore == null) return null
  const color = statusColor(atsScore)

  return (
    <div className="glass-card" style={{ padding: '18px', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: atsIssues?.length > 0 ? '12px' : 0 }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>ATS Compatibility</span>
        <span style={{
          padding: '4px 14px', borderRadius: '999px', fontSize: '14px', fontWeight: '800',
          background: color + '18', color, border: `1px solid ${color}40`,
        }}>
          {atsScore}/100
        </span>
      </div>
      {atsIssues?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {atsIssues.map((issue, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fca5a5' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✗</span> {issue}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
