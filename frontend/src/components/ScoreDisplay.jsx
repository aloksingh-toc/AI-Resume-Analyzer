import { C, scoreInfo } from '../theme'
import AnimatedCounter from '../utils/AnimatedCounter.jsx'

export default function ScoreDisplay({ score, analysis }) {
  const { fill, label } = scoreInfo(score)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const sections = [
    { label: 'Summary',      value: analysis?.summaryScore        ?? null, max: 20, color: '#6366f1' },
    { label: 'Skills',       value: analysis?.skillsScore         ?? null, max: 20, color: '#8b5cf6' },
    { label: 'Experience',   value: analysis?.experienceScore     ?? null, max: 30, color: '#3b82f6' },
    { label: 'Formatting',   value: analysis?.formattingScore     ?? null, max: 15, color: '#0891b2' },
    { label: 'Professional', value: analysis?.professionalismScore ?? null, max: 15, color: '#7c3aed' },
  ]

  return (
    <div className="glass-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
      <h3 style={styles.heading}>Resume Score</h3>

      {/* Glowing Ring */}
      <div style={styles.ringWrap}>
        {/* Outer glow */}
        <div style={{ ...styles.glowOrb, boxShadow: `0 0 60px ${fill}40, 0 0 120px ${fill}20` }} />
        
        <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'relative', zIndex: 1 }}>
          {/* Background track */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
          {/* Background glow track */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke={`${fill}20`} strokeWidth="18" />
          {/* Progress arc */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke={fill}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 12px ${fill}60)`,
            }}
          />
        </svg>

        {/* Center score */}
        <div style={styles.scoreCenter}>
          <span style={{ ...styles.scoreNum, color: '#f1f5f9' }}>
            <AnimatedCounter target={score} />
          </span>
          <span style={styles.scoreMax}>/100</span>
        </div>
      </div>

      {/* Grade badge */}
      <div style={{ ...styles.badge, background: fill + '18', border: `1px solid ${fill}40`, color: fill }}>
        {label}
      </div>

      {/* Section bars */}
      <div style={styles.bars}>
        {sections.map(({ label: l, value, max, color }) => {
          const isNull = value == null
          const pct = isNull ? 0 : Math.round((value / max) * 100)
          return (
            <div key={l} style={styles.barRow}>
              <span style={styles.barLabel}>{l}</span>
              <div style={styles.barTrack}>
                {!isNull && (
                  <div style={{
                    ...styles.barFill,
                    width: `${Math.max(4, pct)}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    boxShadow: `0 0 8px ${color}40`,
                  }} />
                )}
              </div>
              <span style={{ ...styles.barValue, color: isNull ? '#475569' : color }}>
                {isNull ? '—' : `${value}/${max}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  heading: { fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' },
  ringWrap: { position: 'relative', width: '200px', height: '200px', margin: '0 auto 20px' },
  glowOrb: {
    position: 'absolute', top: '50%', left: '50%',
    width: '140px', height: '140px', borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'glowPulse 3s ease-in-out infinite',
  },
  scoreCenter: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex', alignItems: 'baseline', gap: '2px',
    zIndex: 2,
  },
  scoreNum: { fontSize: '52px', fontWeight: '900', lineHeight: 1 },
  scoreMax: { fontSize: '18px', color: '#64748b', fontWeight: '500' },
  badge: {
    display: 'inline-block', padding: '8px 24px', borderRadius: '999px',
    marginBottom: '24px', fontSize: '14px', fontWeight: '800',
    letterSpacing: '1px', textTransform: 'uppercase',
  },
  bars: { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' },
  barRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  barLabel: { fontSize: '11px', color: '#94a3b8', width: '75px', flexShrink: 0, fontWeight: '500' },
  barTrack: { flex: 1, height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '999px', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  barValue: { fontSize: '11px', fontWeight: '700', width: '40px', textAlign: 'right' },
}
