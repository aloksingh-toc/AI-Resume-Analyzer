/**
 * Real, downloadable resume templates — one per category.
 * Each generates a clean HTML resume that can be printed as PDF.
 */

export const TEMPLATES = {
  'Freshers': {
    name: 'Clean Graduate',
    html: `<html><head><meta charset="utf-8"><title>Graduate Resume</title>
<style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a;line-height:1.6}
h1{font-size:28px;border-bottom:3px solid #2563eb;padding-bottom:8px;margin-bottom:4px}
h2{font-size:16px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ddd;margin:24px 0 10px}
.subtitle{color:#666;font-size:14px;margin-bottom:20px}
.section{margin-bottom:14px}.item{margin-bottom:10px}
.item-title{font-weight:700}.item-sub{color:#555;font-size:13px}
.item-desc{font-size:13px;color:#444;margin-top:3px}
.skills{display:flex;flex-wrap:wrap;gap:8px}.skill{background:#eff6ff;color:#1e40af;padding:4px 12px;border-radius:20px;font-size:12px}
ul{margin:4px 0;padding-left:18px}li{font-size:13px;margin-bottom:3px}
@media print{body{margin:0;padding:20px}}</style></head><body>
<h1>PRIYA SHARMA</h1>
<p class="subtitle">📧 priya.sharma@email.com | 📱 +91 98765 43210 | 🔗 linkedin.com/in/priyasharma | 📍 Mumbai, India</p>

<h2>Education</h2>
<div class="item"><span class="item-title">Bachelor of Technology — Computer Science</span><br>
<span class="item-sub">Indian Institute of Information Technology | 2021 – 2025 | CGPA: 8.4/10</span></div>
<div class="item"><span class="item-title">Class XII (CBSE)</span><br>
<span class="item-sub">Delhi Public School, Mumbai | 2021 | 94.2%</span></div>

<h2>Technical Skills</h2>
<div class="skills"><span class="skill">Python</span><span class="skill">JavaScript</span><span class="skill">React</span><span class="skill">Node.js</span><span class="skill">SQL</span><span class="skill">Git</span><span class="skill">REST APIs</span><span class="skill">HTML/CSS</span></div>

<h2>Projects</h2>
<div class="item"><span class="item-title">Campus Connect — Full Stack Web App</span><br>
<span class="item-sub">React, Node.js, MongoDB | Jan – Apr 2025</span>
<ul><li>Built a student networking platform connecting 500+ students across 3 colleges</li><li>Implemented real-time chat using Socket.io, reducing response time by 40%</li><li>Deployed on AWS EC2 with CI/CD pipeline using GitHub Actions</li></ul></div>
<div class="item"><span class="item-title">Stock Market Predictor — ML Project</span><br>
<span class="item-sub">Python, Scikit-learn, Streamlit | Oct – Dec 2024</span>
<ul><li>Trained LSTM model on 5 years of NSE data achieving 78% prediction accuracy</li><li>Built interactive dashboard displaying real-time predictions and trend analysis</li></ul></div>

<h2>Internships</h2>
<div class="item"><span class="item-title">Software Development Intern</span><br>
<span class="item-sub">TechMahindra | Jun – Aug 2024</span>
<ul><li>Developed 3 microservices for internal HR platform using Spring Boot</li><li>Reduced API response time by 25% through query optimization</li></ul></div>

<h2>Achievements</h2>
<ul><li>Winner — Smart India Hackathon 2024 (Software Edition)</li><li>Google Cloud Certified — Associate Cloud Engineer</li><li>President — College Coding Club (2023–2024)</li></ul>
</body></html>`
  },

  'Experienced': {
    name: 'Professional Classic',
    html: `<html><head><meta charset="utf-8"><title>Professional Resume</title>
<style>body{font-family:'Georgia',serif;max-width:800px;margin:40px auto;color:#222;line-height:1.7}
h1{font-size:30px;text-align:center;margin-bottom:2px;letter-spacing:1px}
.contact{text-align:center;color:#555;font-size:13px;margin-bottom:24px;border-bottom:2px solid #333;padding-bottom:16px}
h2{font-size:15px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #999;padding-bottom:4px;margin:24px 0 12px}
.exp-item{margin-bottom:16px}.role{font-weight:700;font-size:15px}.company{color:#444;font-size:13px}
.date{color:#888;font-size:12px;float:right}ul{margin:6px 0;padding-left:18px}li{font-size:13px;margin-bottom:3px}
.skills-row{display:flex;flex-wrap:wrap;gap:6px}.skill-tag{font-size:12px;padding:3px 10px;border:1px solid #ccc;border-radius:3px}
@media print{body{margin:0;padding:20px}}</style></head><body>
<h1>RAHUL VERMA</h1>
<div class="contact">rahul.verma@email.com | +91 98201 23456 | linkedin.com/in/rahulverma | Bengaluru, India</div>

<h2>Professional Summary</h2>
<p style="font-size:13px">Senior Software Engineer with 6+ years of experience building scalable distributed systems. Led teams of 5–8 engineers delivering products serving 2M+ users. Expertise in Java, Spring Boot, microservices, and AWS cloud architecture.</p>

<h2>Experience</h2>
<div class="exp-item"><span class="date">2022 – Present</span><span class="role">Senior Software Engineer</span><br>
<span class="company">Flipkart, Bengaluru</span>
<ul><li>Architected order management system handling 500K+ daily transactions with 99.9% uptime</li><li>Led migration from monolith to microservices, reducing deployment time from 2 hours to 15 minutes</li><li>Mentored 4 junior engineers — all promoted within 18 months</li><li>Reduced infrastructure costs by 30% through AWS spot instance optimization</li></ul></div>

<div class="exp-item"><span class="date">2019 – 2022</span><span class="role">Software Engineer</span><br>
<span class="company">Infosys, Pune</span>
<ul><li>Built REST APIs for banking client serving 1M+ retail customers</li><li>Implemented ELK stack for centralized logging across 20+ microservices</li><li>Received 'Star Performer' award 3 consecutive quarters</li></ul></div>

<h2>Technical Skills</h2>
<div class="skills-row"><span class="skill-tag">Java</span><span class="skill-tag">Spring Boot</span><span class="skill-tag">Microservices</span><span class="skill-tag">AWS</span><span class="skill-tag">Kubernetes</span><span class="skill-tag">Docker</span><span class="skill-tag">Kafka</span><span class="skill-tag">PostgreSQL</span><span class="skill-tag">Redis</span><span class="skill-tag">Git</span></div>

<h2>Education</h2>
<p style="font-size:13px"><strong>B.Tech — Computer Science</strong> | NIT Surathkal | 2015 – 2019 | CGPA: 8.7</p>

<h2>Certifications</h2>
<ul><li>AWS Solutions Architect — Professional</li><li>Oracle Certified Java Programmer (OCJP)</li></ul>
</body></html>`
  },

  'IT / Tech': {
    name: 'Software Engineer',
    html: `<html><head><meta charset="utf-8"><title>Software Engineer Resume</title>
<style>body{font-family:'Consolas','Courier New',monospace;max-width:800px;margin:40px auto;color:#0a0a0a;background:#fafafa}
h1{font-size:26px;color:#0d47a1;margin-bottom:2px}
.tagline{color:#555;font-size:13px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #0d47a1}
h2{font-size:14px;color:#0d47a1;text-transform:uppercase;margin:20px 0 8px;border-left:4px solid #0d47a1;padding-left:10px}
pre{margin:0;font-size:12px;line-height:1.5;background:#f0f4ff;padding:10px;border-radius:4px;overflow-x:auto}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.role{font-weight:700;font-size:14px}.co{font-size:12px;color:#555}
ul{margin:4px 0 0 16px}li{font-size:12px;margin-bottom:2px}.tags{display:flex;flex-wrap:wrap;gap:5px}
.tag{background:#0d47a1;color:#fff;padding:2px 8px;border-radius:3px;font-size:10px;font-family:monospace}
@media print{body{background:#fff;margin:0;padding:20px}}</style></head><body>
<h1>VIKRAM SINGH</h1>
<p class="tagline">github.com/vikramsingh | vikram@email.com | +91 87654 32109 | Bengaluru</p>

<h2>> Technical_Skills</h2>
<div class="tags"><span class="tag">React</span><span class="tag">TypeScript</span><span class="tag">Node.js</span><span class="tag">Python</span><span class="tag">Go</span><span class="tag">PostgreSQL</span><span class="tag">MongoDB</span><span class="tag">Docker</span><span class="tag">AWS</span><span class="tag">GraphQL</span><span class="tag">Redis</span><span class="tag">CI/CD</span></div>

<h2>> Experience</h2>
<div class="role">Senior Frontend Engineer — <span class="co">CRED, Bengaluru (2022–Present)</span></div>
<ul><li>Architected component library used by 12 product teams, reducing UI bugs by 45%</li><li>Optimized Core Web Vitals — improved LCP from 3.2s to 1.1s</li><li>Led migration from JavaScript to TypeScript across 200K+ lines of code</li></ul>

<div class="role">Frontend Developer — <span class="co">Zerodha, Bengaluru (2020–2022)</span></div>
<ul><li>Built trading dashboard handling 1M+ real-time data points per second</li><li>Reduced bundle size by 60% through code splitting and tree shaking</li></ul>

<h2>> Projects</h2>
<pre>// Open Source — DevTools Extension (1.2K GitHub stars)
const DevToolsPro = {
  users: '10,000+ weekly active',
  stack: ['React', 'Chrome APIs', 'WebSocket'],
  impact: 'Reduced debugging time by 35% for 1,200+ developers'
};</pre>

<h2>> Education</h2>
<div class="grid"><div><strong>B.Tech CSE</strong><br>VIT Vellore<br>2016–2020 | 8.9 CGPA</div><div><strong>Certifications</strong><br>AWS Developer Associate<br>Meta Frontend Professional</div></div>
</body></html>`
  },

  'NBFC / Finance': {
    name: 'Banking Professional',
    html: `<html><head><meta charset="utf-8"><title>Finance Resume</title>
<style>body{font-family:'Times New Roman',serif;max-width:800px;margin:40px auto;color:#111;line-height:1.6}
h1{font-size:28px;text-align:center;margin-bottom:2px;color:#1a3a5c}
.contact{text-align:center;font-size:12px;color:#444;border-top:1px solid #999;border-bottom:1px solid #999;padding:6px 0;margin-bottom:20px}
h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;color:#1a3a5c;border-bottom:1px solid #ccc;margin:20px 0 8px}
.exp-title{font-weight:700}.exp-org{font-style:italic;color:#333;font-size:13px}.exp-date{float:right;font-size:11px;color:#777}
ul{margin:4px 0 0 18px}li{font-size:13px;margin-bottom:2px}
.certs{display:flex;gap:20px;flex-wrap:wrap}.cert{font-size:12px;background:#f0f4f8;padding:4px 10px;border-radius:3px}
@media print{body{margin:0;padding:20px}}</style></head><body>
<h1>ANANYA PATEL</h1>
<div class="contact">ananya.patel@email.com | +91 99876 54321 | linkedin.com/in/ananyapatel | Mumbai, India</div>

<h2>Professional Summary</h2>
<p style="font-size:13px">Chartered Accountant with 5+ years in retail banking and NBFC credit operations. Expertise in credit risk assessment, regulatory compliance (RBI guidelines), and portfolio management with AUM exceeding ₹500 Cr.</p>

<h2>Experience</h2>
<div class="exp-item"><span class="exp-date">2021 – Present</span><span class="exp-title">Credit Manager</span><br>
<span class="exp-org">HDFC Bank — Retail Lending Division, Mumbai</span>
<ul><li>Managed credit portfolio of ₹350 Cr with NPA ratio maintained below 1.2%</li><li>Automated credit scoring model reducing processing time from 7 days to 48 hours</li><li>Led team of 8 credit analysts — achieved 98% audit compliance score</li></ul></div>

<div class="exp-item"><span class="exp-date">2019 – 2021</span><span class="exp-title">Associate — Risk Advisory</span><br>
<span class="exp-org">EY India, Mumbai</span>
<ul><li>Conducted internal audits for 3 NBFCs managing combined AUM of ₹2,000 Cr</li><li>Identified process gaps saving ₹12 Cr in potential NPA exposure</li></ul></div>

<h2>Education & Certifications</h2>
<div class="certs"><span class="cert">Chartered Accountant (ICAI)</span><span class="cert">FRM — GARP Level 1</span><span class="cert">B.Com — Mumbai University</span></div>

<h2>Key Skills</h2>
<p style="font-size:13px">Credit Risk | Financial Modeling | RBI Compliance | Bloomberg Terminal | Advanced Excel | SAS | Stakeholder Management</p>
</body></html>`
  },

  'Healthcare': {
    name: 'Medical Professional',
    html: `<html><head><meta charset="utf-8"><title>Healthcare Resume</title>
<style>body{font-family:'Calibri',sans-serif;max-width:800px;margin:40px auto;color:#1a1a1a;line-height:1.6}
h1{font-size:26px;color:#0d4f2e;margin-bottom:2px}.sub{font-size:13px;color:#555;margin-bottom:16px}
h2{font-size:15px;color:#0d4f2e;text-transform:uppercase;border-bottom:1px solid #0d4f2e;padding-bottom:2px;margin:20px 0 8px}
.exp-item{margin-bottom:12px}.role{font-weight:700;font-size:14px}.place{color:#444;font-size:12px}.date{float:right;font-size:11px;color:#888}
ul{margin:4px 0;padding-left:18px}li{font-size:12px;margin-bottom:2px}
.skill-box{display:inline-block;font-size:11px;background:#e8f5e9;color:#1b5e20;padding:3px 10px;margin:2px;border-radius:4px}
@media print{body{margin:0;padding:20px}}</style></head><body>
<h1>DR. ARJUN NAIR</h1>
<p class="sub">MBBS, MD (General Medicine) | MCI Reg: 12345 | arjun.nair@email.com | +91 98112 34567 | Delhi</p>

<h2>Clinical Experience</h2>
<div class="exp-item"><span class="date">2021 – Present</span><span class="role">Senior Resident — General Medicine</span><br>
<span class="place">AIIMS, New Delhi</span>
<ul><li>Managed 50+ bed general medicine ward with daily patient rounds and treatment planning</li><li>Supervised 12 junior residents and 20 interns in clinical procedures and diagnostics</li><li>Published 3 research papers in indexed journals (PubMed ID: 34567890)</li></ul></div>

<div class="exp-item"><span class="date">2018 – 2021</span><span class="role">Junior Resident (MD Training)</span><br>
<span class="place">Safdarjung Hospital, New Delhi</span>
<ul><li>Completed 3-year MD residency with rotations in cardiology, nephrology, emergency medicine</li><li>Managed 500+ ICU admissions with focus on critical care protocols</li></ul></div>

<h2>Education</h2>
<ul><li><strong>MD — General Medicine</strong> | VMMC & Safdarjung Hospital | 2018 – 2021</li><li><strong>MBBS</strong> | Maulana Azad Medical College | 2012 – 2018 | First Class</li></ul>

<h2>Skills & Certifications</h2>
<div><span class="skill-box">ACLS Certified</span><span class="skill-box">BLS Instructor</span><span class="skill-box">EMR Systems</span><span class="skill-box">Clinical Research</span><span class="skill-box">Patient Care</span><span class="skill-box">Diagnosis</span><span class="skill-box">HIPAA Compliance</span></div>
</body></html>`
  },

  'Creative': {
    name: 'Designer Portfolio',
    html: `<html><head><meta charset="utf-8"><title>Designer Resume</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600;700&display=swap');
body{font-family:'Poppins',sans-serif;max-width:800px;margin:40px auto;color:#1a1a2e;background:linear-gradient(135deg,#f5f7fa,#c3cfe2);padding:40px;border-radius:16px}
h1{font-size:38px;font-weight:700;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:0}
.sub{font-size:14px;color:#555;margin-bottom:20px;display:flex;gap:20px;flex-wrap:wrap}
h2{font-size:16px;font-weight:600;color:#764ba2;margin:24px 0 8px;position:relative;padding-left:16px}
h2::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:4px;background:linear-gradient(#667eea,#764ba2);border-radius:2px}
.work-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.work-card{background:#fff;padding:14px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.work-card h3{font-size:14px;margin:0 0 4px}.work-card p{font-size:11px;color:#666;margin:0}
.tools{display:flex;flex-wrap:wrap;gap:8px}.tool{font-size:11px;background:linear-gradient(135deg,#667eea15,#764ba215);padding:4px 12px;border-radius:20px;font-weight:500}
@media print{body{background:#fff;padding:20px;border-radius:0}h1{-webkit-text-fill-color:#764ba2}}</style></head><body>
<h1>MEERA KAPOOR</h1>
<div class="sub"><span>🎨 UI/UX Designer</span><span>📧 meera@email.com</span><span>🔗 behance.net/meerakapoor</span><span>📍 Mumbai</span></div>

<h2>About</h2>
<p style="font-size:13px">UI/UX Designer with 4+ years crafting digital experiences for startups and enterprises. Designed products used by 500K+ users. Passionate about design systems, accessibility, and micro-interactions.</p>

<h2>Selected Work</h2>
<div class="work-grid">
<div class="work-card"><h3>FinTech Dashboard Redesign</h3><p>Complete UX overhaul for Groww — improved conversion by 28%</p></div>
<div class="work-card"><h3>Health App — Meditrack</h3><p>End-to-end design for medication reminder app — 50K downloads</p></div>
<div class="work-card"><h3>E-commerce Design System</h3><p>Built 200+ component library used across 5 product teams</p></div>
<div class="work-card"><h3>EdTech Platform</h3><p>Designed learning experience for Byju's — 4.8★ App Store rating</p></div>
</div>

<h2>Tools</h2>
<div class="tools"><span class="tool">Figma</span><span class="tool">Adobe XD</span><span class="tool">Sketch</span><span class="tool">Protopie</span><span class="tool">After Effects</span><span class="tool">Illustrator</span><span class="tool">HTML/CSS</span><span class="tool">Framer</span></div>

<h2>Experience</h2>
<p style="font-size:13px"><strong>Senior UI/UX Designer</strong> — Upstox (2022–Present)<br><strong>UX Designer</strong> — PhonePe (2020–2022)<br><strong>B.Des</strong> — NID Ahmedabad (2016–2020)</p>
</body></html>`
  },
};

/** Returns the template for a given category, or the first one as default */
export function getTemplate(category) {
  return TEMPLATES[category] || TEMPLATES['Freshers'];
}

/** Opens the template in a new window for preview + printing */
export function openTemplate(category) {
  const tmpl = getTemplate(category);
  const w = window.open('', '_blank', 'width=850,height=700');
  if (!w) { alert('Please allow popups to preview the template.'); return; }
  w.document.write(tmpl.html);
  w.document.close();
  w.focus();
}

/** Downloads the template as an HTML file */
export function downloadTemplate(category) {
  const tmpl = getTemplate(category);
  const blob = new Blob([tmpl.html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tmpl.name.replace(/\s+/g, '_')}_Resume_Template.html`;
  a.click();
  URL.revokeObjectURL(url);
}
