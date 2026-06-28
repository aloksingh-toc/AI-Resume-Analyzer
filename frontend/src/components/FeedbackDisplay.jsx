import { C } from '../theme'
import s from './FeedbackDisplay.module.css'
import { downloadReport } from '../utils/reportDownload'
import JdMatchPanel      from './feedback/JdMatchPanel'
import AtsPanel          from './feedback/AtsPanel'
import KeywordsPanel     from './feedback/KeywordsPanel'
import SectionsChecklist from './feedback/SectionsChecklist'
import FeedbackAccordion from './feedback/FeedbackAccordion'

export default function FeedbackDisplay({ analysis }) {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <div>
          <h3 className={s.heading}>Detailed Feedback</h3>
          <p className={s.filename}>
            {analysis.filename}{analysis.industry ? ` · ${analysis.industry}` : ''}
          </p>
        </div>
        <button onClick={() => downloadReport(analysis)} className={s.downloadBtn}>
          Download Report
        </button>
      </div>

      <JdMatchPanel      jdMatchScore={analysis.jdMatchScore} />
      <AtsPanel          atsScore={analysis.atsScore} atsIssues={analysis.atsIssues} />
      <KeywordsPanel     keywordsFound={analysis.keywordsFound}
                         keywordsMissing={analysis.keywordsMissing}
                         hasJdMatch={analysis.jdMatchScore != null} />
      <SectionsChecklist missingSections={analysis.missingSections} />
      <FeedbackAccordion analysis={analysis} />

      <div className={s.infoStrip}>
        {[
          { label: 'Overall Score', value: `${analysis.score}/100` },
          { label: 'Analyzed',      value: new Date(analysis.submittedAt).toLocaleDateString() },
          { label: 'Report ID',     value: `#${analysis.id}` },
        ].map(({ label, value }) => (
          <div key={label} className={s.infoCard}>
            <span className={s.infoLabel}>{label}</span>
            <span className={s.infoValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


