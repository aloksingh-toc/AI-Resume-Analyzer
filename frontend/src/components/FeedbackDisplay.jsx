import JdMatchPanel from './feedback/JdMatchPanel'
import AtsPanel from './feedback/AtsPanel'
import KeywordsPanel from './feedback/KeywordsPanel'
import SectionsChecklist from './feedback/SectionsChecklist'
import FeedbackAccordion from './feedback/FeedbackAccordion'
import { downloadReport } from '../utils/reportDownload'
import { copyToClipboard } from '../utils/interactive.jsx'

export default function FeedbackDisplay({ analysis }) {
  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.heading}>Detailed Analysis</h3>
          <p style={styles.filename}>
            {analysis.filename}{analysis.industry ? ` · ${analysis.industry}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              const text = [
                `Score: ${analysis.score}/100`,
                `Summary: ${analysis.summaryFeedback || 'N/A'}`,
                `Skills: ${analysis.skillsFeedback || 'N/A'}`,
                `Experience: ${analysis.experienceFeedback || 'N/A'}`,
                `Formatting: ${analysis.formattingFeedback || 'N/A'}`,
                `Overall: ${analysis.overallFeedback || 'N/A'}`,
              ].join('\n\n')
              copyToClipboard(text, 'Feedback')
            }}
            style={styles.btn}
          >
            📋 Copy
          </button>
          <button onClick={() => downloadReport(analysis)} style={styles.btn}>
            📥 Download Report
          </button>
        </div>
      </div>

      {/* Panels */}
      <JdMatchPanel jdMatchScore={analysis.jdMatchScore} />
      <AtsPanel atsScore={analysis.atsScore} atsIssues={analysis.atsIssues} />
      <KeywordsPanel keywordsFound={analysis.keywordsFound} keywordsMissing={analysis.keywordsMissing} hasJdMatch={analysis.jdMatchScore != null} />
      <SectionsChecklist missingSections={analysis.missingSections} />
      <FeedbackAccordion analysis={analysis} />

      {/* Meta strip */}
      <div style={styles.metaStrip}>
        {[
          { label: 'Overall Score', value: `${analysis.score}/100` },
          { label: 'Analyzed', value: new Date(analysis.submittedAt).toLocaleDateString() },
          { label: 'Report ID', value: `#${analysis.id}` },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card" style={{ padding: '14px', textAlign: 'center', flex: 1, minWidth: '100px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  heading:  { fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginBottom: '4px' },
  filename: { fontSize: '13px', color: '#64748b' },
  btn:      { padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  metaStrip:{ display: 'flex', gap: '10px', flexWrap: 'wrap' },
}
