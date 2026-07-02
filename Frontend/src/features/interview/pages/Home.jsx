import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const C = {
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  pinkMid:    '#c026d3',
  glow:       '#c026d3',
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#8878a8',
  sub:        '#d8b4fe',
  greenLight: '#052e16',
  greenText:  '#4ade80',
  amberLight: '#1c1004',
}

const RowIcon = ({ title = '' }) => {
  const isFrontend = /frontend|ui|design/i.test(title)
  return (
    <span style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.sub }}>
      {isFrontend ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      )}
    </span>
  )
}

const StatCard = ({ value, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '95px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 700, color: C.text, marginTop: '2px' }}>{value}</div>
  </div>
)

const Home = () => {
  const { loading, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription]   = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [fileName, setFileName]               = useState('')
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  // FIXED: Browser tab ka title badal kar HireFlow kiya
  useEffect(() => {
    document.title = "HireFlow - Dashboard"
  }, [])

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files[0]
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    navigate(`/interview/${data._id}`)
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${C.cardBorder}`, borderTopColor: C.pink, animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '16px', color: C.muted }}>Building your interview strategy...</p>
      </div>
    )
  }

  const scoreStyle = (s) =>
    s >= 80 ? { bg: C.greenLight, text: C.greenText } :
    s >= 60 ? { bg: C.amberLight, text: '#fcd34d' } :
              { bg: `${C.pink}22`, text: C.sub }

  const interviewsCount = reports.length
  const avgScore = reports.length ? Math.round(reports.reduce((a, r) => a + r.matchScore, 0) / reports.length) : 0
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const thisWeekCount = reports.filter(r => new Date(r.createdAt) >= weekAgo).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: C.bg, fontFamily: 'inherit' }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      {/* FIXED: Navbar branding change kiya with matching layout styles */}
      <header style={{ height: '92px', background: 'linear-gradient(to bottom, #110b24, #0e0a1a)', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', flexShrink: 0, boxShadow: `0 4px 24px rgba(7, 4, 14, 0.6)` }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              {/* Clean matching H badge */}
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff', boxShadow: `0 0 20px ${C.glow}77` }}>
                H
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ffffff' }}>Hire</span>
                <span style={{ color: '#e9d5ff', fontWeight: '300', marginLeft: '2px' }}>flow</span>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, padding: '5px 14px', borderRadius: '20px', boxShadow: `0 2px 10px ${C.glow}44`, letterSpacing: '0.3px' }}>Dashboard</span>
          </div>

          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: C.pink, border: `2px solid ${C.pink}55`, boxShadow: `0 0 12px ${C.pink}33` }}>R</div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', padding: '0 40px' }}>
        <div style={{ width: '100%', maxWidth: '1200px', height: '100%', display: 'flex', flexDirection: 'column', padding: '28px 0 24px', gap: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.cardBorder}`, paddingBottom: '16px', flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>New Interview</h1>
              <p style={{ fontSize: '13.5px', color: C.muted, margin: '4px 0 0' }}>Configure details to generate an interview preparation blueprint.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '36px' }}>
              <StatCard value={interviewsCount} label="Interviews" />
              <StatCard value={`${avgScore}%`} label="Avg Score" />
              <StatCard value={thisWeekCount} label="This Week" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '32px', flex: 1, minHeight: 0 }}>

            <div style={{ display: 'flex', flexDirection: 'column', height: '96%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Target job description</h2>
                <span style={{ fontSize: '10px', fontWeight: 600, color: C.sub, background: `${C.pink}18`, padding: '2px 6px', borderRadius: '4px' }}>Required</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'"}
                style={{ width: '100%', flex: 1, resize: 'none', background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '18px', fontSize: '15px', color: C.text, fontFamily: 'inherit', outline: 'none', lineHeight: 1.55, transition: 'all 0.2s ease-in-out' }}
                onFocus={(e) => { e.target.style.borderColor = C.pink; e.target.style.boxShadow = `0 0 16px ${C.pink}33`; e.target.style.background = '#120c24' }}
                onBlur={(e) => { e.target.style.borderColor = C.cardBorder; e.target.style.boxShadow = 'none'; e.target.style.background = C.cardBg }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: C.muted, marginTop: '4px', flexShrink: 0 }}>{jobDescription.length} / 5000</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '96%' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: '0 0 10px', flexShrink: 0 }}>Your profile</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' }}>
                <label htmlFor="resume-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: `1px dashed ${C.cardBorder}`, borderRadius: '12px', background: C.cardBg, flex: 0.9, padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                       onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.pink; e.currentTarget.style.boxShadow = `0 0 14px ${C.pink}22`; e.currentTarget.style.background = '#120c24' }}
                       onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = C.cardBg }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  <p style={{ fontSize: '14.5px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{fileName || 'Click to upload or drag & drop file'}</p>
                  <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>PDF or DOCX up to 5MB</p>
                  <input ref={resumeInputRef} type="file" id="resume-main" accept=".pdf,.docx" style={{ display: 'none' }} onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <div style={{ flex: 1, height: '1px', background: C.cardBorder }} />
                  <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: C.cardBorder }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1.1 }}>
                  <label style={{ fontSize: '14.5px', fontWeight: 600, color: C.text, marginBottom: '8px', flexShrink: 0 }}>Quick self-description</label>
                  <textarea
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Briefly describe your experience, key skills, and years of experience..."
                    style={{ width: '100%', flex: 1, resize: 'none', background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '16px', fontSize: '15px', color: C.text, fontFamily: 'inherit', outline: 'none', lineHeight: 1.55, transition: 'all 0.2s ease-in-out' }}
                    onFocus={(e) => { e.target.style.borderColor = C.pink; e.target.style.boxShadow = `0 0 16px ${C.pink}33`; e.target.style.background = '#120c24' }}
                    onBlur={(e) => { e.target.style.borderColor = C.cardBorder; e.target.style.boxShadow = 'none'; e.target.style.background = C.cardBg }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '16px', flexShrink: 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {reports.length > 0 && (
                <div key={reports[0]._id} onClick={() => navigate(`/interview/${reports[0]._id}`)}
                  style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = C.pink}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = C.cardBorder}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <RowIcon title={reports[0].title} />
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Recent: {reports[0].title || 'Untitled position'}</h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', background: scoreStyle(reports[0].matchScore).bg, color: scoreStyle(reports[0].matchScore).text, marginLeft: '8px', flexShrink: 0 }}>{reports[0].matchScore}% match</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleGenerateReport}
              style={{ display: 'flex', alignItems: 'center', gap: '0px', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: `0 4px 16px ${C.glow}33`, flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${C.glow}44` }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${C.glow}33` }}
            >
              Generate my interview strategy
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home