import { C, scoreInfo, tracking } from '../theme'
import AnimatedCounter from '../utils/AnimatedCounter.jsx'
import s from './ScoreDisplay.module.css'

export default function ScoreDisplay({ score, analysis }) {
  // scoreInfo from theme.js — same logic, single source of truth
  const getColor = scoreInfo

  const { fill, text, label } = getColor(score)
  const radius           = 70
  const circumference    = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // NOTE: sub-scores can be null when the AI truncates its JSON response.
  // We explicitly keep them as null rather than computing a fake estimate,
  // so the UI shows "N/A" instead of a misleading calculated value.
  const sections = [
    { label: 'Summary',      value: analysis?.summaryScore        ?? null, max: 20 },
    { label: 'Skills',       value: analysis?.skillsScore         ?? null, max: 20 },
    { label: 'Experience',   value: analysis?.experienceScore     ?? null, max: 30 },
    { label: 'Formatting',   value: analysis?.formattingScore     ?? null, max: 15 },
    { label: 'Professional', value: analysis?.professionalismScore ?? null, max: 15 },
  ]

  return (
    <div className={s.container}>
      <h3 className={s.heading}>Resume Score</h3>

      {/* Ring */}
      <div className={s.circleWrap}>
        <svg width="100%" height="100%" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#ddd6fe" strokeWidth="14" />
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={fill}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 6px ${fill}55)` }}
          />
        </svg>
        <div className={s.scoreInner}>
          <span className={s.scoreNumber} style={{ color: text }}>
            <AnimatedCounter target={score} />
          </span>
          <span className={s.outOf}>/100</span>
        </div>
      </div>

      {/* Badge */}
      <div className={s.badge} style={{ background: fill + '18', border: `1px solid ${fill}55` }}>
        <span style={{ color: text, fontWeight: '700', fontSize: '14px' }}>{label}</span>
      </div>

      {/* Section bars */}
      <div className={s.bars}>
        {sections.map(({ label: l, value, max }) => {
          const isNull   = value == null
          const pct      = isNull ? 0 : Math.round((value / max) * 100)
          const barColor = isNull ? '#d1d5db' : getColor(pct).fill
          return (
            <div key={l} className={s.barRow}>
              <span className={s.barLabel}>{l}</span>
              <div className={s.barTrack}>
                {!isNull && <div className={s.barFill} style={{ width: `${Math.max(4, pct)}%`, background: barColor }} />}
              </div>
              <span className={s.barValue} style={{ color: barColor }}>
                {isNull ? 'N/A' : `${value}/${max}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


