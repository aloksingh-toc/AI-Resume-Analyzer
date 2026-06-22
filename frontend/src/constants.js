/** Maximum resume upload size shown to the user. Must match ResumeFileValidator.MAX_FILE_BYTES. */
export const MAX_FILE_SIZE_MB   = 5
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/** Number of free analyses a guest gets. Must match FreeAnalysisTracker.FREE_LIMIT. */
export const FREE_ANALYSIS_LIMIT = 3

/** OAuth redirect helper — keeps env-var access out of UI components. */
export const getOAuthUrl = (provider) =>
  `${import.meta.env.VITE_API_URL || ''}/oauth2/authorization/${provider}`

/** Feedback section metadata shared by FeedbackAccordion and the downloadable report. */
export const FEEDBACK_SECTIONS = [
  { key: 'summaryFeedback',    label: 'Summary',        scoreKey: 'summaryScore',    max: 20,   color: '#6366f1' },
  { key: 'skillsFeedback',     label: 'Skills',         scoreKey: 'skillsScore',     max: 20,   color: '#8b5cf6' },
  { key: 'experienceFeedback', label: 'Experience',     scoreKey: 'experienceScore', max: 30,   color: '#3b82f6' },
  { key: 'formattingFeedback', label: 'Formatting',     scoreKey: 'formattingScore', max: 15,   color: '#0891b2' },
  { key: 'overallFeedback',    label: 'Overall Action', scoreKey: null,              max: null, color: '#7c3aed' },
]
