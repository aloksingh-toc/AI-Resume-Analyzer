import { scoreColor } from '../theme'

export default function HistoryList({ history, onSelect, hasMore, onLoadMore, loading }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <p style={{ color: '#64748b', fontSize: '15px', fontStyle: 'italic' }}>No analyses yet.</p>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>Upload a resume to get started.</p>
      </div>
    )
  }

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px' }}>Analysis History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.map((item) => (
          <div
            key={item.id}
            className="history-card"
            onClick={() => onSelect(item)}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '10px', fontWeight: '700', color: '#f59e0b',
                background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                padding: '3px 7px', borderRadius: '5px',
              }}>PDF</div>
              <div>
                <p style={{ color: '#f1f5f9', fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>{item.filename}</p>
                <p style={{ color: '#64748b', fontSize: '12px' }}>{new Date(item.submittedAt).toLocaleString()}</p>
              </div>
            </div>
            <div style={{
              padding: '4px 13px', borderRadius: '999px', fontWeight: '800', fontSize: '14px',
              background: scoreColor(item.score) + '18', color: scoreColor(item.score),
              border: `1px solid ${scoreColor(item.score)}40`,
            }}>
              {item.score}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          style={{
            marginTop: '14px', width: '100%', padding: '10px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', color: '#94a3b8', fontSize: '14px', cursor: 'pointer',
            opacity: loading ? 0.45 : 1,
          }}
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      )}
    </div>
  )
}
