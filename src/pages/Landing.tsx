import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'

const previewApplications = [
  { company: 'Northstar', role: 'Product Designer', status: 'Interview', date: 'Today' },
  { company: 'Fieldnote', role: 'Senior UX Designer', status: 'Applied', date: 'Yesterday' },
  { company: 'Common Thread', role: 'Design Lead', status: 'Follow up', date: 'May 18' },
]

export default function Landing() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link to="/" className="landing-brand" aria-label="Applywell home">
          <BrandLogo />
        </Link>
        <nav aria-label="Main navigation" className="landing-nav">
          <a href="#preview">Product</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <div className="landing-actions">
          <Link className="landing-signin" to="/login">Sign in</Link>
          <Link className="landing-start" to="/register">Get started <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span aria-hidden="true" /> A clearer way to job search</p>
          <h1 id="landing-title">Your career.<br /><span>Clearly organized.</span></h1>
          <p className="landing-description">
            Keep every application, follow-up, and interview in one calm workspace. Connect your workflow to AI tools with MCP when you need a little extra help.
          </p>
          <div className="landing-hero-actions">
            <Link className="landing-start landing-start-large" to="/register">Get started <span aria-hidden="true">↗</span></Link>
            <a className="landing-explore" href="#preview">Explore the workspace <span aria-hidden="true">↓</span></a>
          </div>
          <p className="landing-note">A thoughtful home for your next opportunity.</p>
        </div>

        <div className="landing-art" id="preview" aria-label="Illustrative Applywell application dashboard preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-brand"><span className="preview-mark">a</span> applywell</div>
              <div className="preview-avatar" aria-hidden="true">J</div>
            </div>
            <div className="preview-content">
              <div className="preview-heading">
                <div><p className="preview-kicker">TUESDAY, MAY 21</p><h2>Your search, in focus.</h2></div>
                <span className="preview-add" aria-hidden="true">＋ New application</span>
              </div>
              <div className="preview-stats" aria-label="Example statistics">
                <div><span>Active applications</span><strong>12</strong><small>across your search</small></div>
                <div><span>In conversation</span><strong>04</strong><small>next steps ahead</small></div>
                <div><span>Interviews</span><strong>02</strong><small>you’ve got this</small></div>
              </div>
              <div className="preview-table-head"><span>RECENT APPLICATIONS</span><span>VIEW ALL&nbsp; ↗</span></div>
              <div className="preview-rows">
                {previewApplications.map((application) => (
                  <div className="preview-row" key={application.company}>
                    <div className="preview-company-mark" aria-hidden="true">{application.company.slice(0, 1)}</div>
                    <div className="preview-role"><strong>{application.company}</strong><span>{application.role}</span></div>
                    <span className={`preview-status ${application.status === 'Interview' ? 'is-interview' : ''}`}>{application.status}</span>
                    <time>{application.date}</time>
                  </div>
                ))}
              </div>
              <div className="preview-footer"><span><i /> YOUR MOMENTUM, AT A GLANCE</span><span>THIS WEEK&nbsp; ↗</span></div>
              <div className="preview-chart" aria-hidden="true">
                <div className="chart-labels"><span>8</span><span>6</span><span>4</span><span>2</span></div>
                <svg viewBox="0 0 520 74" preserveAspectRatio="none" role="presentation">
                  <path d="M0 60 C30 58 40 44 72 48 S115 60 145 42 S190 49 218 35 S256 44 290 28 S332 38 360 24 S405 37 432 16 S484 24 520 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M0 60 C30 58 40 44 72 48 S115 60 145 42 S190 49 218 35 S256 44 290 28 S332 38 360 24 S405 37 432 16 S484 24 520 6 L520 74 L0 74Z" fill="currentColor" opacity=".045" />
                </svg>
                <div className="chart-days"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
              </div>
            </div>
          </div>
          <div className="preview-caption"><span>01 — YOUR SEARCH, AT A GLANCE</span><span>ILLUSTRATIVE PREVIEW</span></div>
        </div>
      </section>

      <section className="landing-bottom" id="how-it-works" aria-label="Product summary">
        <p>ONE PLACE FOR THE DETAILS THAT MOVE YOU FORWARD.</p>
        <div><span>Applications</span><span>Interviews</span><span>Follow-ups</span><span>MCP + AI integrations</span></div>
      </section>
      <footer className="landing-footer"><span>© Applywell</span><Link to="/privacy-policy">Privacy</Link><span>Make room for what’s next.</span></footer>
    </main>
  )
}
