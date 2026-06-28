import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { lightTokens as C, tracking } from '../theme'
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '../constants'
import s from './UploadSection.module.css'

const INDUSTRIES = [
  '', 'Software / IT', 'Data Science / AI', 'DevOps / Cloud', 'Cybersecurity',
  'Banking / Finance', 'NBFC / Lending', 'Investment Banking', 'Accounting / Audit',
  'Marketing / Growth', 'Sales / Business Development', 'Human Resources',
  'Operations / Supply Chain', 'Healthcare / Clinical', 'Pharma / Biotech',
  'Consulting / Strategy', 'Legal', 'Education', 'Creative / Design', 'Other',
]

export default function UploadSection({ onAnalyze, loading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [industry, setIndustry]             = useState('')
  const [jdOpen, setJdOpen]                 = useState(false)
  const [error, setError]                   = useState('')

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

  return (
    <div className={`${s.container} upload-card`}>
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

      {/* Industry selector — Rec #5 */}
      <div className={s.fieldGroup}>
        <label className={s.fieldLabel}>Target Industry / Role</label>
        <select
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          className={s.select}
          disabled={loading}
        >
          <option value="">— Select for tailored feedback (optional) —</option>
          {INDUSTRIES.filter(i => i).map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* JD toggle — Rec #1 */}
      <div className={s.jdToggleRow}>
        <button
          type="button"
          onClick={() => setJdOpen(o => !o)}
          className={s.jdToggleBtn}
          disabled={loading}
        >
          <span className={s.jdToggleIcon} style={{ transform: jdOpen ? 'rotate(90deg)' : 'none' }}>›</span>
          {jdOpen ? 'Hide' : 'Paste Job Description'} — get keyword match score
        </button>
      </div>

      {jdOpen && (
        <div className={s.jdArea}>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here. The AI will calculate how well your resume matches the role and list missing keywords."
            rows={6}
            className={s.textarea}
            disabled={loading}
          />
          {jobDescription.trim() && (
            <p className={s.jdHint}>
              {jobDescription.trim().split(/\s+/).length} words pasted — keyword match will be calculated.
            </p>
          )}
        </div>
      )}

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


