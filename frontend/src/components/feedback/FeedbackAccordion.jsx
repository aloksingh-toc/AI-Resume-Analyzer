import { useState } from 'react'

const SECTIONS = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',    max: 20, color: '#6366f1' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',     max: 20, color: '#8b5cf6' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore', max: 30, color: '#3b82f6' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore', max: 15, color: '#0891b2' },
  { key: 'overallFeedback',    label: 'Action Plan',    scoreKey: null,              max: null, color: '#7c3aed' },
]

function firstSentence(text) {
  if (!text) return 'No feedback available.'
  const m = text.match(/^.+?[.!?](?:\s|$)/)
  return m ? m[0].trim() : (text.length > 110 ? text.slice(0, 110) + '…' : text)
}

export default function FeedbackAccordion({ analysis }) {
  const [expanded, setExpanded] = useState(null)
  const toggle = key => setExpanded(prev => prev === key ? null : key)

  return (
    <div className="glass-card" style={{ padding: '18px', marginBottom: '14px' }}>
      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>Click any section to read full feedback</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SECTIONS.map(({ key, label, scoreKey, max, color }) => {
          const score = scoreKey ? analysis[scoreKey] : null
          const pct = score != null ? Math.round((score / max) * 100) : null
          const text = analysis[key] || ''
          const isOpen = expanded === key

          return (
            <div
              key={key}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${isOpen ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '10px', overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                onClick={() => toggle(key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>{label}</span>
                  {!isOpen && <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{firstSentence(text)}</span>}
                </div>
                {score != null && (
                  <span style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
                    background: color + '15', color, border: `1px solid ${color}30`, flexShrink: 0,
                  }}>
                    {score}/{max}
                  </span>
                )}
                <span style={{
                  color: '#64748b', fontSize: '20px', transition: 'transform 0.25s',
                  transform: isOpen ? 'rotate(90deg)' : 'none', flexShrink: 0,
                }}>›</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 16px 16px 36px', animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ color: '#94a3b8', lineHeight: '1.75', fontSize: '14px' }}>{text || 'No feedback available.'}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
