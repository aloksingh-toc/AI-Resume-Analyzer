import { useState, useEffect, useRef } from 'react'
import { C } from '../theme'

const STAGES = [
  { label: 'Extracting text from PDF',    icon: '📄', detail: 'Reading and parsing your document…' },
  { label: 'Analyzing resume structure',   icon: '🔍', detail: 'Detecting sections, format, and layout…' },
  { label: 'Evaluating skills & experience', icon: '🧠', detail: 'Assessing content quality and depth…' },
  { label: 'Generating AI-powered insights', icon: '✨', detail: 'Crafting personalized feedback…' },
  { label: 'Finalizing your report',        icon: '📊', detail: 'Compiling scores and recommendations…' },
]

/**
 * Classy multi-stage processing overlay shown while the backend analyzes a resume.
 *
 * Simulates progress through conceptual stages with smooth transitions.
 * Not connected to actual backend progress — this is purely UI polish.
 */
export default function ProcessingOverlay({ filename }) {
  const [stage, setStage]         = useState(0)
  const [progress, setProgress]   = useState(0)
  const [fadeStage, setFadeStage] = useState(0)
  const intervalRef               = useRef(null)
  const startTime                 = useRef(Date.now())

  useEffect(() => {
    // Reset on mount
    setStage(0)
    setProgress(0)
    setFadeStage(0)
    startTime.current = Date.now()

    // Each stage gets roughly equal time, but random variance for realism
    const stageDurations = STAGES.map(() => 1400 + Math.random() * 1200)

    let currentStage = 0
    let elapsedInStage = 0
    const tick = 80 // ms per tick

    intervalRef.current = setInterval(() => {
      elapsedInStage += tick
      const stageDuration = stageDurations[currentStage] || 2000
      const stageProgress = Math.min(elapsedInStage / stageDuration, 1)

      // Overall progress: stages are weighted
      const overallProgress = Math.min(
        ((currentStage + stageProgress) / STAGES.length) * 100,
        99.5 // never quite hit 100 — that happens when the result arrives
      )
      setProgress(overallProgress)

      // Move to next stage
      if (stageProgress >= 1 && currentStage < STAGES.length - 1) {
        currentStage++
        elapsedInStage = 0
        setFadeStage(currentStage)
        setTimeout(() => setStage(currentStage), 50)
      }
    }, tick)

    return () => clearInterval(intervalRef.current)
  }, [])

  const current = STAGES[stage]
  const elapsed = Math.floor((Date.now() - startTime.current) / 1000)

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Pulsing icon ring */}
        <div style={styles.iconRing}>
          <div style={styles.ringPulse} />
          <div style={styles.ringPulse2} />
          <span style={styles.iconEmoji}>{current.icon}</span>
        </div>

        {/* Stage title */}
        <h3 style={styles.stageTitle}>{current.label}</h3>
        <p style={styles.stageDetail}>{current.detail}</p>

        {/* File name */}
        <p style={styles.fileName}>
          Analyzing: <strong>{filename || 'resume.pdf'}</strong>
        </p>

        {/* Stage indicators */}
        <div style={styles.stageRow}>
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              style={{
                ...styles.stageDot,
                background: i < stage
                  ? C.accent
                  : i === stage
                    ? C.accent
                    : '#1e293b',
                border: i <= stage
                  ? `2px solid ${C.accent}`
                  : '2px solid #334155',
                boxShadow: i === stage
                  ? '0 0 12px rgba(99,102,241,0.5)'
                  : 'none',
                transform: i === stage ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
          {/* Shimmer effect */}
          <div
            style={{
              ...styles.progressShimmer,
              left: `${Math.max(0, progress - 8)}%`,
            }}
          />
        </div>

        {/* Percentage & elapsed */}
        <div style={styles.progressInfo}>
          <span style={styles.progressPct}>{Math.round(progress)}%</span>
          <span style={styles.elapsed}>{elapsed}s elapsed</span>
        </div>
      </div>

    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(6,13,26,0.82)',
    backdropFilter: 'blur(10px)',
    animation: 'fadeSlideIn 0.3s ease',
    padding: '24px',
  },

  card: {
    background: 'linear-gradient(160deg, #0d1629 0%, #111d36 100%)',
    border: '1px solid #1a2744',
    borderRadius: '24px',
    padding: '44px 40px 36px',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.08)',
    animation: 'fadeSlideIn 0.35s ease',
  },

  // ── Pulsing icon ring ──
  iconRing: {
    position: 'relative',
    width: '96px',
    height: '96px',
    margin: '0 auto 24px',
  },
  ringPulse: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: '96px', height: '96px',
    borderRadius: '50%',
    background: 'transparent',
    border: '2px solid rgba(99,102,241,0.4)',
    transform: 'translate(-50%, -50%)',
    animation: 'ringPulseAnim 2.2s ease-in-out infinite',
  },
  ringPulse2: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: '120px', height: '120px',
    borderRadius: '50%',
    background: 'transparent',
    border: '1.5px solid rgba(139,92,246,0.25)',
    transform: 'translate(-50%, -50%)',
    animation: 'ringPulse2Anim 2.8s ease-in-out infinite',
  },
  iconEmoji: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '40px',
    lineHeight: 1,
    filter: 'grayscale(0)',
  },

  // ── Stage text ──
  stageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: C.text_dark,
    marginBottom: '6px',
    animation: 'fadeSlideIn 0.3s ease',
  },
  stageDetail: {
    fontSize: '13px',
    color: C.textMuted,
    marginBottom: '10px',
    minHeight: '18px',
    animation: 'fadeSlideIn 0.3s ease',
  },
  fileName: {
    fontSize: '12px',
    color: '#475569',
    marginBottom: '24px',
  },

  // ── Stage dots ──
  stageRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '18px',
  },
  stageDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.5s ease',
  },

  // ── Progress bar ──
  progressTrack: {
    position: 'relative',
    height: '4px',
    background: '#1e293b',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
    transition: 'width 0.4s ease',
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    width: '30px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
    borderRadius: '999px',
    animation: 'shimmerAnim 1.6s ease-in-out infinite',
    transition: 'left 0.4s ease',
  },

  // ── Info row ──
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  progressPct: {
    fontSize: '13px',
    fontWeight: '700',
    color: C.accent,
  },
  elapsed: {
    fontSize: '12px',
    color: '#475569',
  },
}
