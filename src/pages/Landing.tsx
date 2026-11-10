import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'

const productShots = [
  {
    image: '/landing/applications.png',
    alt: 'Applywell Applications screen with a searchable list of job applications and stages.',
    number: '01',
    title: 'Know where every application stands.',
    copy: 'Keep company, role, status, recruiter, and next step together. Find the right opportunity with search, filters, and active or archived views.',
  },
  {
    image: '/landing/metrics.png',
    alt: 'Applywell Metrics screen showing a conversion funnel, pipeline averages, status bars, and weekly volume.',
    number: '02',
    title: 'See your search take shape.',
    copy: 'Understand application activity and your pipeline over time, all in the same workspace as your day-to-day follow-ups.',
  },
  {
    image: '/landing/exports.png',
    alt: 'Applywell Exports screen with CSV and XLSX options, application filters, scheduled exports, and export history.',
    number: '03',
    title: 'Keep a copy of your work.',
    copy: 'Export the fields you need to CSV or XLSX. Schedule recurring backups to Google Drive when you connect your account.',
  },
]

const questions = [
  {
    question: 'What is Applywell?',
    answer: 'Applywell is a workspace for organizing job applications, interview stages, and follow-ups. It also includes metrics and export tools to help you review your search.',
  },
  {
    question: 'How does the AI integration work?',
    answer: 'Ask Applywell is an in-app assistant for questions about your application data. You can also connect MCP-compatible AI clients to Applywell. The assistant responds to requests; it does not apply to jobs or send messages on your behalf.',
  },
  {
    question: 'Can I export my application data?',
    answer: 'Yes. You can download selected application data as CSV or XLSX. You can also configure recurring exports to Google Drive after connecting a Google account.',
  },
  {
    question: 'Can I use Applywell on my phone?',
    answer: 'Yes. The interface adapts to mobile and desktop screens so you can check your search wherever you are.',
  },
  {
    question: 'Where can I learn how my information is handled?',
    answer: 'Read the Privacy Policy for details about account information, application data, integrations, and your choices.',
  },
]

function Screenshot({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`landing-shot ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
      <span className="landing-shot-label">SAMPLE WORKSPACE</span>
    </div>
  )
}

export default function Landing() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link to="/" className="landing-brand" aria-label="Applywell home"><BrandLogo /></Link>
        <nav aria-label="Main navigation" className="landing-nav">
          <a href="#features">Features</a>
          <a href="#ai">AI + MCP</a>
          <a href="#security">Security</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="landing-actions">
          <Link className="landing-signin" to="/login">Sign in</Link>
          <Link className="landing-start" to="/register">Get started <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span aria-hidden="true" /> A clearer way to job search</p>
          <h1 id="landing-title">Your career.<br /><span>Clearly organized.</span></h1>
          <p className="landing-description">
            Keep applications, interviews, and follow-ups in one workspace. Bring your job search into focus, then connect compatible AI tools with MCP.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-start landing-start-large" to="/register">Get started <span aria-hidden="true">→</span></Link>
            <a className="landing-explore" href="#features">Explore the workspace <span aria-hidden="true">↓</span></a>
          </div>
          <p className="landing-note">A sample of the real Applywell workspace.</p>
        </div>
        <div className="landing-hero-shot" aria-label="Applywell product preview">
          <Screenshot src="/landing/dashboard.png" alt="Applywell Dashboard with application metrics, achievements, and follow-up lists." />
          <p className="landing-shot-caption"><span>YOUR SEARCH, AT A GLANCE</span><span>DEMO DATA</span></p>
        </div>
      </section>

      <section className="landing-intro" aria-label="Applywell at a glance">
        <p>ONE PLACE FOR THE DETAILS THAT MOVE YOU FORWARD.</p>
        <div><span>Applications</span><span>Interviews</span><span>Follow-ups</span><span>Metrics</span><span>Exports</span></div>
      </section>

      <section className="landing-features" id="features" aria-labelledby="features-title">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">A workspace built around your search</p>
          <h2 id="features-title">Less juggling.<br /><span>More clarity.</span></h2>
          <p>From the first application to the next conversation, keep the details close and your momentum visible.</p>
        </div>
        <div className="landing-feature-list">
          {productShots.map((shot) => (
            <article className="landing-feature-row" key={shot.number}>
              <div className="landing-feature-copy">
                <p className="landing-eyebrow">{shot.number} / THE WORKSPACE</p>
                <h3>{shot.title}</h3>
                <p>{shot.copy}</p>
              </div>
              <Screenshot src={shot.image} alt={shot.alt} />
            </article>
          ))}
        </div>
      </section>

      <section className="landing-ai" id="ai" aria-labelledby="ai-title">
        <div className="landing-ai-copy">
          <p className="landing-eyebrow"><span aria-hidden="true" /> AI that works with your search</p>
          <h2 id="ai-title">Your data,<br /><span>in the conversation.</span></h2>
          <p>Ask Applywell about your applications, progress, or follow-ups. Connect an MCP-compatible AI client to work with your Applywell data from the tools you already use.</p>
          <p className="landing-ai-detail">The assistant provides information when you ask. It does not submit applications or contact recruiters for you.</p>
          <Link className="landing-text-link" to="/mcp">Learn about MCP <span aria-hidden="true">→</span></Link>
        </div>
        <Screenshot src="/landing/assistant.png" alt="Ask Applywell chat showing a sample summary of applications and scheduled interviews." className="landing-ai-shot" />
      </section>

      <section className="landing-security" id="security" aria-labelledby="security-title">
        <div>
          <p className="landing-eyebrow">Built with care for your information</p>
          <h2 id="security-title">Security is part<br />of the system.</h2>
        </div>
        <div className="landing-security-copy">
          <p>Applywell’s published security practices include BCrypt password hashing, HTTPS/TLS for browser connections, rotating refresh tokens stored in HttpOnly cookies, and rate limiting on authentication endpoints.</p>
          <Link to="/privacy-policy">Read the Privacy Policy <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="landing-faq" id="faq" aria-labelledby="faq-title">
        <div className="landing-faq-heading">
          <p className="landing-eyebrow">Good to know</p>
          <h2 id="faq-title">Questions,<br /><span>answered.</span></h2>
          <p>Need more detail? Visit <Link to="/help">Help</Link> or read our <Link to="/privacy-policy">Privacy Policy</Link>.</p>
        </div>
        <div className="landing-faq-list">
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-cta" aria-labelledby="cta-title">
        <p className="landing-eyebrow">Make room for what’s next</p>
        <h2 id="cta-title">A little more clarity<br />goes a long way.</h2>
        <Link className="landing-start landing-start-large" to="/register">Get started <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-footer-brand"><BrandLogo /></Link>
        <nav aria-label="Footer navigation"><a href="#features">Features</a><a href="#ai">AI + MCP</a><a href="#security">Security</a><a href="#faq">FAQ</a><Link to="/privacy-policy">Privacy</Link><Link to="/login">Sign in</Link></nav>
        <span>© Applywell</span>
      </footer>
    </main>
  )
}
