import { useState } from 'react'
import { darkTokens as D, C } from '../theme'
import { openTemplate, downloadTemplate, getTemplate } from '../utils/resumeTemplates'

const categories = ['Freshers', 'Experienced', 'IT / Tech', 'NBFC / Finance', 'Healthcare', 'Creative']

const templates = [
  { id: 1,  name: 'Clean Graduate',       category: 'Freshers',       desc: 'Minimal, ATS-friendly layout for fresh graduates with projects & internships focus' },
  { id: 2,  name: 'Tech Fresher',         category: 'Freshers',       desc: 'Perfect for CS / IT fresh graduates — skills-forward with GitHub/project links' },
  { id: 3,  name: 'Business Graduate',    category: 'Freshers',       desc: 'Commerce / MBA fresher with internship experience and analytical skills' },
  { id: 4,  name: 'Campus Placement',     category: 'Freshers',       desc: 'One-page template built for campus drives — concise, high-impact' },
  { id: 5,  name: 'Professional Classic', category: 'Experienced',    desc: '3–8 years experience — timeless clean layout with quantified achievements' },
  { id: 6,  name: 'Senior Manager',       category: 'Experienced',    desc: 'Leadership-focused, highlights team impact, P&L ownership' },
  { id: 7,  name: 'Executive Resume',     category: 'Experienced',    desc: 'C-suite and director level — boardroom-ready with strategic highlights' },
  { id: 8,  name: 'Career Change',        category: 'Experienced',    desc: 'Highlight transferable skills — bridge domains seamlessly' },
  { id: 9,  name: 'Banking Professional', category: 'NBFC / Finance', desc: 'Retail banking, relationship manager, branch operations' },
  { id: 10, name: 'Financial Analyst',    category: 'NBFC / Finance', desc: 'CFA, equity research, investment banking — numbers-first layout' },
  { id: 11, name: 'Credit Manager',       category: 'NBFC / Finance', desc: 'Credit risk, loan processing, NBFC / HFC focused' },
  { id: 12, name: 'Wealth Manager',       category: 'NBFC / Finance', desc: 'HNI advisory, portfolio management, private banking' },
  { id: 13, name: 'Software Engineer',    category: 'IT / Tech',      desc: 'SDE / backend / frontend developer — code-first monospace style' },
  { id: 14, name: 'Full Stack Developer', category: 'IT / Tech',      desc: 'MERN, Java, Python — projects-forward with live demo links' },
  { id: 15, name: 'Data Scientist',       category: 'IT / Tech',      desc: 'ML / AI / analytics — highlights models, metrics, and impact' },
  { id: 16, name: 'DevOps / Cloud',       category: 'IT / Tech',      desc: 'AWS, Azure, Kubernetes — infrastructure and reliability focused' },
  { id: 17, name: 'Marketing Manager',    category: 'Creative',       desc: 'Digital marketing, brand manager — campaign metrics and growth' },
  { id: 18, name: 'HR Manager',           category: 'Creative',       desc: 'Human resources, talent acquisition — people and process focus' },
  { id: 19, name: 'Medical Professional', category: 'Healthcare',     desc: 'Doctor, specialist, clinician — clinical layout with publications' },
  { id: 20, name: 'Nursing Resume',       category: 'Healthcare',     desc: 'RN, staff nurse, ICU — skills-first format with certifications' },
  { id: 21, name: 'Pharma / Research',    category: 'Healthcare',     desc: 'Pharmaceutical, biotech, clinical research — R&D focused' },
  { id: 22, name: 'Designer Portfolio',   category: 'Creative',       desc: 'UI/UX, graphic design — visual-forward with project showcase' },
  { id: 23, name: 'Content Strategist',   category: 'Creative',       desc: 'Writers, editors, social media — portfolio of published work' },
]

export default function TemplateGallery() {
  const [active, setActive] = useState('Freshers')

  const filtered = templates.filter(t => t.category === active)

  return (
    <div style={styles.wrap}>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Resume Templates</h2>
        <p style={styles.pageSubtitle}>
          Download a free, professionally designed resume template — fill it in, then upload here for an instant AI score.
        </p>
      </div>

      {/* Category pills */}
      <div className="category-pills">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{ ...styles.pill, ...(active === cat ? styles.pillActive : {}) }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preview the actual template for active category */}
      <TemplatePreview category={active} />

      <p style={styles.count}>{filtered.length} template{filtered.length !== 1 ? 's' : ''} in {active}</p>

      {/* Grid */}
      <div className="template-grid">
        {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
      </div>
    </div>
  )
}

/** Shows a live mini-preview of the actual resume template for the category */
function TemplatePreview({ category }) {
  const tmpl = getTemplate(category)
  if (!tmpl) return null

  return (
    <div style={styles.previewBanner}>
      <div style={styles.previewHeader}>
        <span style={styles.previewLabel}>📄 Preview — {tmpl.name}</span>
        <div style={styles.previewActions}>
          <button onClick={() => openTemplate(category)} style={styles.previewBtn}>
            👁 View & Print
          </button>
          <button onClick={() => downloadTemplate(category)} style={{ ...styles.previewBtn, background: C.gradient, color: '#fff', border: 'none' }}>
            ⬇ Download
          </button>
        </div>
      </div>
      <div style={styles.previewFrame}>
        <iframe
          srcDoc={tmpl.html}
          style={styles.iframe}
          title="Template Preview"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  )
}

function TemplateCard({ template: t }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview area */}
      <div style={styles.preview}>
        <div style={styles.previewDoc}>
          <div style={styles.docLine1} />
          <div style={styles.docLine2} />
          <div style={{ height: '10px' }} />
          <div style={styles.docLineShort} />
          <div style={styles.docLineFull} />
          <div style={styles.docLineMed} />
          <div style={styles.docLineFull} />
        </div>
        <div style={styles.catBadge}>{t.category}</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <h3 style={styles.name}>{t.name}</h3>
        <p style={styles.desc}>{t.desc}</p>
        <div style={styles.btnRow}>
          <button
            onClick={(e) => { e.stopPropagation(); openTemplate(t.category) }}
            style={{ ...styles.btn, ...(hovered ? styles.btnHover : {}) }}
          >
            Preview
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); downloadTemplate(t.category) }}
            style={{ ...styles.btn, ...styles.btnDownload, ...(hovered ? styles.btnDownloadHover : {}) }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap:        { width: '100%', animation: 'fadeIn 0.3s ease' },
  pageHeader:  { marginBottom: '24px' },
  pageTitle:   { fontSize: '28px', fontWeight: '800', color: D.text, marginBottom: '8px', letterSpacing: '-0.5px' },
  pageSubtitle:{ color: D.textMuted, fontSize: '15px', lineHeight: '1.6' },
  count:       { color: D.textMuted, fontSize: '13px', marginBottom: '16px' },

  pill:        { padding: '8px 18px', borderRadius: '999px', border: `1px solid ${D.border}`, background: 'transparent', color: D.textMuted, cursor: 'pointer', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  pillActive:  { background: D.gradient, color: '#fff', border: '1px solid transparent', fontWeight: '700' },

  // Preview banner
  previewBanner: { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '16px', marginBottom: '20px', boxShadow: '0 4px 16px rgba(99,102,241,0.08)' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' },
  previewLabel:  { fontSize: '14px', fontWeight: '700', color: C.text },
  previewActions:{ display: 'flex', gap: '8px' },
  previewBtn:    { padding: '7px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: '#f8faff', color: C.sub, cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' },
  previewFrame:  { borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff', height: '340px' },
  iframe:        { width: '100%', height: '100%', border: 'none', transform: 'scale(0.55)', transformOrigin: 'top left', width: '182%', height: '182%' },

  card:        { background: C.card_light, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s', cursor: 'pointer' },
  cardHover:   { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${C.accent}30`, borderColor: '#a5b4fc' },

  preview:     { background: D.card, padding: '28px 24px 20px', position: 'relative', display: 'flex', justifyContent: 'center' },
  previewDoc:  { background: '#ffffff', borderRadius: '6px', padding: '16px 14px', width: '140px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '6px' },
  docLine1:    { height: '8px', background: C.accent, borderRadius: '4px', width: '70%' },
  docLine2:    { height: '5px', background: C.border, borderRadius: '4px', width: '50%' },
  docLineShort:{ height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '35%' },
  docLineFull: { height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '100%' },
  docLineMed:  { height: '4px', background: '#e2e8f0', borderRadius: '4px', width: '80%' },

  catBadge:    { position: 'absolute', top: '10px', right: '10px', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', background: `${C.accent}25`, color: '#a5b4fc', border: `1px solid ${C.accent}40`, letterSpacing: '0.3px' },

  body:        { padding: '16px 18px 18px' },
  name:        { fontSize: '15px', fontWeight: '700', color: C.text, marginBottom: '6px' },
  desc:        { fontSize: '12px', color: C.muted, lineHeight: '1.6', marginBottom: '14px' },
  btnRow:      { display: 'flex', gap: '8px' },
  btn:         { flex: 1, padding: '9px 12px', borderRadius: '8px', border: `1.5px solid ${C.accent}`, background: 'transparent', color: C.accent, fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
  btnHover:    { background: '#eef2ff' },
  btnDownload: { background: C.gradient, color: '#fff', border: 'none' },
  btnDownloadHover: { opacity: 0.9, transform: 'scale(1.02)' },
}
