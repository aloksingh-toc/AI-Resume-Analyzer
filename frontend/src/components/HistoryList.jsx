import { C, scoreColor } from '../theme'
import s from './HistoryList.module.css'

export default function HistoryList({ history, onSelect, hasMore, onLoadMore, loading }) {
  if (!history || history.length === 0) {
    return (
      <div className={s.empty}>
        <p style={{ color: C.muted, fontSize: '15px', fontStyle: 'italic' }}>No analyses yet.</p>
        <p style={{ color: C.muted, fontSize: '13px', marginTop: '6px' }}>Upload a resume to get started.</p>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <h3 className={s.heading}>Analysis History</h3>
      <div className={s.list}>
        {history.map((item) => (
          <div
            key={item.id}
            className={`${s.card} history-card`}
            onClick={() => onSelect(item)}
          >
            <div className={s.cardLeft}>
              <div className={s.pdfBadge}>PDF</div>
              <div>
                <p className={s.cardName}>{item.filename}</p>
                <p className={s.cardDate}>{new Date(item.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className={s.scoreBadge} style={{ background: scoreColor(item.score) + '18', border: `1px solid ${scoreColor(item.score)}44`, color: scoreColor(item.score) }}>
              {item.score}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          className={`${s.loadMoreBtn} ${loading ? s.loadMoreDisabled : ''}`}
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}


