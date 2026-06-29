import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { lightTokens as C, tracking } from '../theme'
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '../constants'
import s from './UploadSection.module.css'

const INDUSTRY_GROUPS = [
  {
    name: '💻 Technology',
    items: [
      { value: 'Software / IT',           icon: '💻', color: '#6366f1' },
      { value: 'Data Science / AI',       icon: '🤖', color: '#8b5cf6' },
      { value: 'DevOps / Cloud',          icon: '☁️', color: '#0891b2' },
      { value: 'Cybersecurity',           icon: '🔒', color: '#059669' },
    ]
  },
  {
    name: '💰 Finance & Business',
    items: [
      { value: 'Banking / Finance',       icon: '🏦', color: '#d97706' },
      { value: 'Investment Banking',      icon: '📈', color: '#dc2626' },
      { value: 'Accounting / Audit',      icon: '📊', color: '#7c3aed' },
      { value: 'Consulting / Strategy',   icon: '💡', color: '#f59e0b' },
      { value: 'Sales / Business Development', icon: '🤝', color: '#ea580c' },
      { value: 'Marketing / Growth',      icon: '📣', color: '#db2777' },
    ]
  },
  {
    name: '🏥 Healthcare & Science',
    items: [
      { value: 'Healthcare / Clinical',   icon: '🏥', color: '#16a34a' },
      { value: 'Pharma / Biotech',        icon: '🧬', color: '#9333ea' },
    ]
  },
  {
    name: '📋 Professional Services',
    items: [
      { value: 'Human Resources',         icon: '👥', color: '#2563eb' },
      { value: 'Operations / Supply Chain', icon: '🚚', color: '#4f46e5' },
      { value: 'Legal',                   icon: '⚖️',  color: '#475569' },
      { value: 'Education',               icon: '📚', color: '#0284c7' },
      { value: 'Creative / Design',       icon: '🎨', color: '#ec4899' },
      { value: 'Other',                   icon: '📋', color: '#6b7280' },
    ]
  },
]

export default function UploadSection({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [industry, setIndustry]             = useState('')
  const [jdOpen, setJdOpen]                 = useState(false)
  const [error, setError]                   = useState('')
  const [pasteFlash, setPasteFlash]         = useState(false)
  const [industryOpen, setIndustryOpen]       = useState(false)
  const [expandedGroup, setExpandedGroup]     = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setError('')
    if (rejected.length > 0) { setError('Please upload a valid PDF file (max 5 MB).'); return }
    if (accepted.length > 0)  setSelectedFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: loading,
  })

  const handleAnalyze = () => {
    if (!selectedFile) { setError('Please select a PDF file first.'); return }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB} MB.`)
      return
    }
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }
    onAnalyze(selectedFile, jobDescription, industry)
  }

  const handleJdPaste = (e) => {
    const text = e.clipboardData?.getData('text')
    if (text && text.length > 50) {
      setPasteFlash(true)
      setTimeout(() => setPasteFlash(false), 600)
    }
  }

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0

  return (
    <div className={`${s.container} upload-card`}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <h2 className={s.title}>Upload Your Resume</h2>
        <p className={s.subtitle}>PDF only · Max {MAX_FILE_SIZE_MB} MB · Results in under 20 seconds</p>
      </div>

      {/* ── Collapsible Industry Selector ── */}
      <div className={`${s.sectionBlock} ${industryOpen ? s.jdSectionOpen : ''}`}>
        <button
          type="button"
          onClick={() => setIndustryOpen(o => !o)}
          className={s.jdToggle}
          disabled={loading}
        >
          <div className={s.jdToggleLeft}>
            <span className={s.jdIcon}>🎯</span>
            <div className={s.jdToggleText}>
              <span className={s.jdToggleTitle}>
                Target Industry
                {industry && <span style={{ color: '#22c55e', marginLeft: '8px', fontSize: '11px' }}>● Selected</span>}
              </span>
              <span className={s.jdToggleSub}>
                {industry ? `Tailored for: ${industry}` : 'Select for industry-specific feedback (optional)'}
              </span>
            </div>
          </div>
          <div className={s.jdToggleRight}>
            {industry && (
              <button onClick={(e) => { e.stopPropagation(); setIndustry(''); }} className={s.clearBtn}>✕ Clear</button>
            )}
            <span className={s.jdChevron} style={{ transform: industryOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </div>
        </button>

        {industryOpen && (
          <div className={s.jdBody}>
            {INDUSTRY_GROUPS.map((group) => {
              const isExpanded = expandedGroup === group.name || expandedGroup === null
              const hasSelection = group.items.some(item => item.value === industry)
              return (
                <div key={group.name} style={{ marginBottom: '10px' }}>
                  <button
                    onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 12px', background: hasSelection ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${hasSelection ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '8px', cursor: 'pointer', color: '#94a3b8',
                      fontSize: '13px', fontWeight: '600', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none', fontSize: '10px' }}>▶</span>
                    <span>{group.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#64748b' }}>{group.items.length}</span>
                  </button>
                  {isExpanded && (
                    <div className={s.industryGrid} style={{ marginTop: '8px', padding: '0 4px' }}>
                      {group.items.map(({ value, icon, color }) => {
                        const selected = industry === value
                        return (
                          <button
                            key={value}
                            onClick={() => setIndustry(selected ? '' : value)}
                            disabled={loading}
                            className={s.industryChip}
                            style={{
                              borderColor: selected ? color : 'rgba(255,255,255,0.06)',
                              background: selected ? color + '18' : 'rgba(255,255,255,0.03)',
                              boxShadow: selected ? `0 0 0 2px ${color}30` : 'none',
                              transform: selected ? 'scale(1.03)' : 'scale(1)',
                              color: '#94a3b8',
                            }}
                          >
                            <span className={s.chipIcon}>{icon}</span>
                            <span className={s.chipLabel} style={{ color: selected ? color : '#94a3b8' }}>
                              {value.length > 22 ? value.slice(0, 20) + '…' : value}
                            </span>
                            {selected && <span className={s.chipCheck} style={{ color }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Interactive JD Section ── */}
      <div className={`${s.sectionBlock} ${jdOpen ? s.jdSectionOpen : ''}`}>
        <button
          type="button"
          onClick={() => setJdOpen(o => !o)}
          className={s.jdToggle}
          disabled={loading}
        >
          <div className={s.jdToggleLeft}>
            <span className={s.jdIcon}>📝</span>
            <div className={s.jdToggleText}>
              <span className={s.jdToggleTitle}>Job Description</span>
              <span className={s.jdToggleSub}>
                {jdOpen ? 'Paste the JD for keyword match scoring' : 'Get a keyword match score against a specific job'}
              </span>
            </div>
          </div>
          <div className={s.jdToggleRight}>
            {wordCount > 0 && !jdOpen && (
              <span className={s.jdWordBadge}>{wordCount} words</span>
            )}
            <span className={s.jdChevron} style={{ transform: jdOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </div>
        </button>

        {jdOpen && (
          <div className={`${s.jdBody} ${pasteFlash ? s.jdPasteFlash : ''}`}>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              onPaste={handleJdPaste}
              placeholder="Paste the full job description here…"
              rows={8}
              className={s.textarea}
              disabled={loading}
              autoFocus
            />
            <div className={s.jdFooter}>
              <div className={s.jdStats}>
                <span className={s.jdStat}>
                  <span style={{ fontWeight: '700', color: wordCount > 20 ? '#16a34a' : '#6b7280' }}>
                    {wordCount}
                  </span> words
                </span>
                <span className={s.jdStat}>
                  <span style={{ fontWeight: '700', color: wordCount > 20 ? '#16a34a' : '#6b7280' }}>
                    {Math.min(100, Math.round(wordCount * 0.75))}%
                  </span> match potential
                </span>
                <span className={s.jdStat}>
                  {wordCount > 50 ? '✅ Detailed' : wordCount > 20 ? '👍 Good enough' : '⚠️ Add more detail'}
                </span>
              </div>
              <div className={s.jdPowerBar}>
                <div
                  className={s.jdPowerFill}
                  style={{
                    width: `${Math.min(100, wordCount * 1.5)}%`,
                    background: wordCount > 50
                      ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                      : wordCount > 20
                        ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                        : 'linear-gradient(90deg, #dc2626, #f87171)',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`${s.dropzone} ${isDragActive ? s.dzActive : ''} ${loading ? s.dzDisabled : ''}`}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          <div className={s.filePreview}>
            <div className={s.fileIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <p className={s.fileName}>{selectedFile.name}</p>
              <p className={s.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div className={s.dropContent}>
            <div className={s.uploadIcon}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#6366f1' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16,16 12,12 8,16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <p className={s.dropText}>{isDragActive ? 'Drop it here…' : 'Drag & drop your resume PDF'}</p>
            <p className={s.dropHint}>or click to browse</p>
          </div>
        )}
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className={s.btnRow}>
        {selectedFile && !loading && (
          <button onClick={() => { setSelectedFile(null); setError('') }} className={s.removeBtn}>
            Remove
          </button>
        )}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className={`${s.analyzeBtn} ${(!selectedFile || loading) ? s.btnDisabled : ''}`}
        >
          {loading ? (
            <span className={s.loadingInner}>
              <span className={s.spinner} /> Analyzing…
            </span>
          ) : 'Analyze Resume'}
        </button>
      </div>
    </div>
  )
}
