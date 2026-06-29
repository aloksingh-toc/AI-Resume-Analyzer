import { useState, useEffect, useRef } from 'react'
import UploadSection from './components/UploadSection'
import ScoreDisplay from './components/ScoreDisplay'
import FeedbackDisplay from './components/FeedbackDisplay'
import HistoryList from './components/HistoryList'
import LoginPage from './components/LoginPage'
import ProcessingOverlay from './components/ProcessingOverlay'
import ParticleBackground from './components/ParticleBackground'
import ConfettiEffect from './components/ConfettiEffect'
import ResumeTips from './components/ResumeTips'
import TemplateGallery from './components/TemplateGallery'
import HowItWorks from './components/HowItWorks'
import { analyzeResume, getHistory, getMe, logout, setUnauthorizedHandler, getStats } from './services/api'
import { useToast } from './utils/interactive.jsx'
import { darkTokens as C, C as rawTokens, tracking } from './theme'
import { FREE_ANALYSIS_LIMIT } from './constants'

/** Strips HTML tags from backend error strings and returns a clean message. */
function extractErrorMessage(err) {
  const raw = err.response?.data?.error || err.message || 'An error occurred. Please try again.'
  return String(raw).replace(/<[^>]*>/g, '')
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [username, setUsername]               = useState('')
  const [view, setView]                       = useState('upload')
  const [loading, setLoading]                 = useState(false)
  const loadingRef                            = useRef(false)   // debounce guard
  const [analyzingFile, setAnalyzingFile]     = useState(null)  // filename shown in overlay
  const [historyLoading, setHistoryLoading]   = useState(false)
  const [analysis, setAnalysis]               = useState(null)
  const [prevScore, setPrevScore]             = useState(null)   // Rec #7 before/after
  const [history, setHistory]                 = useState([])
  const [historyPage, setHistoryPage]         = useState(0)
  const [historyHasMore, setHistoryHasMore]   = useState(false)
  const [error, setError]                     = useState('')
  const [showLoginModal, setShowLoginModal]   = useState(false)
  const [loginMessage, setLoginMessage]       = useState('')
  const [showConfetti, setShowConfetti]       = useState(false)
  const [totalAnalyses, setTotalAnalyses]     = useState(null)   // Rec #3 social proof
  const [totalHistoryCount, setTotalHistoryCount] = useState(0)  // L-1 true total (not paginated)
  const historyRequestId                     = useRef(0)        // guards against out-of-order responses
  const { ToastContainer }                   = useToast()

  useEffect(() => {
    setUnauthorizedHandler(() => setIsAuthenticated(false))
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'success') {
      window.history.replaceState({}, '', '/')
    }
    checkAuth()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await getStats()
      setTotalAnalyses(data.totalAnalyses)
    } catch { /* non-critical */ }
  }

  const checkAuth = async () => {
    try {
      const data = await getMe()
      setUsername(data.username)
      setIsAuthenticated(true)
      fetchHistory(0)
    } catch {
      setIsAuthenticated(false)
    }
  }

  const handleLogin = (name) => {
    setUsername(name)
    setIsAuthenticated(true)
    setShowLoginModal(false)
    setLoginMessage('')
    fetchHistory(0)
  }

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    setIsAuthenticated(false)
    setUsername('')
    setHistory([])
    setTotalHistoryCount(0)
    setAnalysis(null)
    setPrevScore(null)
    setView('upload')
    setError('')
  }

  const openLogin = (msg = '') => {
    setLoginMessage(msg)
    setShowLoginModal(true)
  }

  const fetchHistory = async (page = 0) => {
    const requestId = ++historyRequestId.current
    setHistoryLoading(true)
    try {
      const data = await getHistory(page)
      if (requestId !== historyRequestId.current) return // a newer request superseded this one
      setHistory(prev => page === 0 ? data.content : [...prev, ...data.content])
      setHistoryPage(data.page)
      setHistoryHasMore(!data.last)
      if (page === 0) setTotalHistoryCount(data.totalElements)  // L-1 true total from backend
    } catch (err) {
      console.warn('Failed to load history:', err.message)
    } finally {
      if (requestId === historyRequestId.current) setHistoryLoading(false)
    }
  }

  // Rec #7 — capture last score before new analysis so we can show the delta
  const handleAnalyze = async (file, jobDescription, industry) => {
    if (loadingRef.current) return  // guard against double-clicks
    loadingRef.current = true
    setLoading(true)
    setAnalyzingFile(file.name)
    setError('')
    const lastScore = analysis?.score ?? (history.length > 0 ? history[0].score : null)
    try {
      const result = await analyzeResume(file, jobDescription, industry)
      setPrevScore(lastScore)
      setAnalysis(result)
      setView('result')
      setTotalAnalyses(n => (n != null ? n + 1 : null))
      // Confetti for scores >= 80
      if (result.score >= 80) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500) }
      if (isAuthenticated) fetchHistory(0)
    } catch (err) {
      if (err.response?.data?.loginRequired) {
        openLogin('You\'ve used your free analysis. Sign in for unlimited access.')
        return
      }
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
      setAnalyzingFile(null)
      loadingRef.current = false
    }
  }

  const handleSelectHistory = (item) => {
    setPrevScore(null)
    setAnalysis(item)
    setView('result')
  }
  const handleNewAnalysis = () => { setAnalysis(null); setPrevScore(null); setError(''); setView('upload') }

  const proofNumber = totalAnalyses != null ? totalAnalyses.toLocaleString() : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ParticleBackground />
      <ConfettiEffect active={showConfetti} />
      {/* ── Header ── */}
      <header className="app-shell">
        <div className="logo">
          <div className="logoMark">R</div>
          <span className="logoText">AI Resume Analyzer</span>
        </div>
        <nav className="app-nav">
          <button onClick={() => setView('upload')}
            className={`nav-btn ${view === 'upload' ? 'nav-btn-active' : ''}`}>
            Analyze
          </button>
          <button onClick={() => setView('templates')}
            className={`nav-btn ${view === 'templates' ? 'nav-btn-active' : ''}`}>
            Templates
          </button>
          {isAuthenticated && (
            <button onClick={() => { setView('history'); fetchHistory(0) }}
              className={`nav-btn ${view === 'history' ? 'nav-btn-active' : ''}`}>
              History {totalHistoryCount > 0 && <span className="nav-badge">{totalHistoryCount}</span>}
            </button>
          )}
          {isAuthenticated ? (
            <>
                <span className={`user-chip user-chip-text`}>{username}</span>
              <button onClick={handleLogout} className="signout-btn">Sign Out</button>
            </>
          ) : (
            <button onClick={() => openLogin()} className="signin-btn glow-btn">Sign In</button>
          )}
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="app-main">

        {/* Upload View */}
        {view === 'upload' && (
          <div className="upload-view">

            {/* Hero */}
            <div className="hero-section">
              <div className="hero-badge">AI-Powered Resume Analysis</div>
                <h1 className="hero-title gradient-text" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: '-0.03em' }}>
                Land the Interview.
              </h1>
              <p className="hero-sub">
                Your resume gets <strong style={{ color: C.accent }}>6 seconds</strong> of attention.
                Get an honest AI score and know exactly what to fix before you apply.
              </p>

              {/* Social proof counter — Rec #3 */}
              {proofNumber && (
                <div className="proof-row">
                  <span className="proof-dot" />
                  <span className="proof-text">
                    <strong style={{ color: '#f1f5f9' }}>{proofNumber}</strong> resumes analyzed
                  </span>
                </div>
              )}

              {!isAuthenticated && (
                <p className="free-note">{FREE_ANALYSIS_LIMIT} free analyses — no account needed</p>
              )}
            </div>

            {/* How It Works — Rec #4 */}
            <HowItWorks />

            <UploadSection onAnalyze={handleAnalyze} loading={loading} />

            {error && <div className="error-box">{error}</div>}



            <ResumeTips />
          </div>
        )}

        {/* Result View */}
        {view === 'result' && analysis && (
          <div className="result-view">
            <div className="result-toolbar">
              <button onClick={handleNewAnalysis} className="back-btn">← New Analysis</button>
              <h2 className="result-title">Analysis Results</h2>
            </div>

            {/* Before / After score delta — Rec #7 */}
            {prevScore != null && prevScore !== analysis.score && (
              <div className="delta-banner">
                <span className="delta-icon">
                  {analysis.score > prevScore ? '↑' : '↓'}
                </span>
                <span style={{ color: '#c7d2fe', fontSize: '14px' }}>
                  Score changed from <strong>{prevScore}</strong> to{' '}
                  <strong>{analysis.score}</strong>
                  {' '}({analysis.score > prevScore ? '+' : ''}{analysis.score - prevScore} points
                  {analysis.score > prevScore ? ' — great progress!' : ' — keep improving'})
                </span>
              </div>
            )}

            {!isAuthenticated && (
              <div className="nudge-banner">
                <span>Sign in to save your history and get unlimited analyses</span>
                <button onClick={() => openLogin()} className="nudge-btn">Sign In Free</button>
              </div>
            )}

            <div className="result-grid">
              <ScoreDisplay score={analysis.score} analysis={analysis} />
              <FeedbackDisplay analysis={analysis} />
            </div>
          </div>
        )}

        {/* Templates View */}
        {view === 'templates' && <TemplateGallery />}

        {/* History View */}
        {view === 'history' && (
          <div className="history-view">
            <h2 className="section-title">Past Analyses</h2>
            {historyLoading && history.length === 0
              ? <p style={{ color: C.textMuted, fontSize: '14px' }}>Loading…</p>
              : <HistoryList
                  history={history}
                  onSelect={handleSelectHistory}
                  hasMore={historyHasMore}
                  onLoadMore={() => fetchHistory(historyPage + 1)}
                  loading={historyLoading}
                />
            }
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>Built with Spring Boot · React · Groq AI · PostgreSQL</p>
      </footer>

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}>
          <LoginPage onLogin={handleLogin} onClose={() => setShowLoginModal(false)} message={loginMessage} />
        </div>
      )}

      {/* ── Processing Overlay ── */}
      {loading && analyzingFile && <ProcessingOverlay filename={analyzingFile} />}

      {/* ── Toast Notifications ── */}
      <ToastContainer />
    </div>
  )
}


