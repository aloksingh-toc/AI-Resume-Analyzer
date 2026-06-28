import { useState, useEffect } from 'react'



/**
 * Toast notification system. Call toast.show('message', 'success'|'error'|'info')
 */
const listeners = new Set()
let toastId = 0

export function showToast(message, type = 'info') {
  const id = ++toastId
  listeners.forEach(fn => fn({ id, message, type }))
  return id
}

const toastStyles = {
  container: {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '380px',
  },
  toast: {
    padding: '12px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  success: { background: '#065f46', color: '#d1fae5', border: '1px solid #059669' },
  error:   { background: '#7f1d1d', color: '#fee2e2', border: '1px solid #dc2626' },
  info:    { background: '#1e3a5f', color: '#dbeafe', border: '1px solid #3b82f6' },
}

/**
 * Copy text to clipboard with toast feedback
 */
export async function copyToClipboard(text, label = 'Text') {
  try {
    await navigator.clipboard.writeText(text)
    showToast(`${label} copied to clipboard!`, 'success')
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    showToast(`${label} copied!`, 'success')
  }
}


export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (toast) => {
      setToasts(prev => [...prev, toast])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 3000)
    }
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  const ToastContainer = () => (
    <div style={toastStyles.container}>
      {toasts.map(t => (
        <div key={t.id} style={{ ...toastStyles.toast, ...toastStyles[t.type] }}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'i'} {t.message}
        </div>
      ))}
    </div>
  )

  return { toasts, ToastContainer }
}

