import { useState } from 'react'
import { login, register } from '../services/api'
import { lightTokens, C as _theme } from '../theme'
import { getOAuthUrl } from '../constants'
import s from './LoginPage.module.css'

const C = { ...lightTokens, bg: _theme.bg, warm: _theme.accentWarm, grad: _theme.gradient }

export default function LoginPage({ onLogin, onClose, message }) {
  const [tab, setTab]                   = useState('signin')
  const [username, setUsername]         = useState('')
  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')
  const [email, setEmail]               = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  const isModal = !!onClose

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (tab === 'signup') {
      if (password !== confirmPassword) { setError('Passwords do not match'); return }
      if (password.length < 8) { setError('Password must be at least 8 characters'); return }
      if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter'); return }
      if (!/[0-9]/.test(password)) { setError('Password must contain at least one digit'); return }
    }
    setLoading(true)
    try {
      const data = tab === 'signin'
        ? await login(username, password)
        : await register(username, password, email)
      onLogin(data.username)
    } catch (err) {
      setError(err.response?.data?.error || (tab === 'signin' ? 'Invalid credentials.' : 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider) => {
    window.location.href = getOAuthUrl(provider)
  }

  const card = (
    <div style={{ ...styles.card, ...(isModal ? styles.cardModal : {}) }}>
      {isModal && (
        <button onClick={onClose} className={s.closeBtn} aria-label="Close">✕</button>
      )}

      <div className={s.logoRow}>
        <div className={s.logoMark}>R</div>
        <span className={s.logoText}>AI Resume Analyzer</span>
      </div>

      {message && (
        <div className={s.messageBanner}>
          <span>✦</span> {message}
        </div>
      )}

      <div className={s.tabs}>
        <button
          onClick={() => setTab('signin')}
          style={{ ...styles.tabBtn, ...(tab === 'signin' ? styles.tabActive : {}) }}
        >Sign In</button>
        <button
          onClick={() => setTab('signup')}
          style={{ ...styles.tabBtn, ...(tab === 'signup' ? styles.tabActive : {}) }}
        >Sign Up</button>
      </div>

      <div className={s.oauthSection}>
        <button onClick={() => handleOAuth('google')} className={s.oauthBtn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {tab === 'signin' && (
        <>
          <div className={s.divider}>
            <span className={s.dividerLine} />
            <span className={s.dividerText}>or sign in with username</span>
            <span className={s.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={s.input}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={s.input}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className={s.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.btnDisabled : {}) }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </>
      )}

      {tab === 'signup' && (
        <>
          <div className={s.divider}>
            <span className={s.dividerLine} />
            <span className={s.dividerText}>or sign up with username</span>
            <span className={s.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>Username <span style={{ color: C.muted }}>(min 3 chars)</span></label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={s.input}
                placeholder="Choose a username"
                required
                autoFocus
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Email <span style={{ color: C.muted }}>(optional)</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={s.input}
                placeholder="your@email.com"
              />
            </div>
            <div className={s.field}>
              <label className={s.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={s.input}
                placeholder="Min 8 chars, 1 uppercase, 1 digit"
                required
                minLength={8}
              />
              <div className={s.pwHints}>
                <span style={{ color: password.length >= 8 ? '#16a34a' : C.muted }}>
                  {password.length >= 8 ? '✓' : '○'} 8+ characters
                </span>
                <span style={{ color: /[A-Z]/.test(password) ? '#16a34a' : C.muted }}>
                  {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase letter
                </span>
                <span style={{ color: /[0-9]/.test(password) ? '#16a34a' : C.muted }}>
                  {/[0-9]/.test(password) ? '✓' : '○'} One digit
                </span>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirm(e.target.value)}
                className={s.input}
                placeholder="Repeat your password"
                required
              />
            </div>
            {error && <p className={s.error}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, ...(loading ? styles.btnDisabled : {}) }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p style={{ color: C.muted, fontSize: '12px', textAlign: 'center', margin: 0 }}>
              Already have an account?{' '}
              <span style={{ color: C.sub, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setTab('signin')}>
                Sign in
              </span>
            </p>
          </form>
        </>
      )}
    </div>
  )

  if (isModal) return card

  return (
    <div className={s.page}>{card}</div>
  )
}


