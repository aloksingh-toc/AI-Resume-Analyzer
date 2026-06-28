import { C, tracking } from '../../theme'

/**
 * Displays which sections are present vs missing in the resume.
 * Accepts missingSections from the AI analysis (no hardcoded list —
 * the AI dynamically detects sections in its understanding pass).
 */
export default function SectionsChecklist({ missingSections }) {
  const missing = missingSections || []

  // Build display from whatever the AI reports — no static list to fall out of sync
  if (missing.length === 0) {
    return (
      <div style={styles.wrap}>
        <span style={styles.label}>Resume Sections</span>
        <p style={styles.allGood}>All essential sections appear to be present.</p>
      </div>
    )
  }

  return (
    <div style={styles.wrap}>
      <span style={styles.label}>Missing Resume Sections</span>
      <div style={styles.grid}>
        {missing.map(sec => (
          <div key={sec} style={styles.bad}>
            <span style={styles.icon}>✗</span>
            <span>{sec}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap:    { background: '#f8faff', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' },
  label:   { display: 'block', fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: tracking.tight, marginBottom: '10px' },
  grid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '6px', alignItems: 'start' },
  bad:     { display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', height: '32px' },
  icon:    { fontWeight: '800', fontSize: '13px', flexShrink: 0 },
  allGood: { fontSize: '13px', color: '#15803d', fontWeight: '500', padding: '4px 0' },
}
