import React, { useState, useRef, useEffect, useContext } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { AuthContext } from '../../auth/auth.context.jsx'
import { useAuth } from '../../auth/hooks/useAuth.js' // 🔥 Sahi relative path update kiya

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

const StatCard = ({ value, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '95px' }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 700, color: C.text, marginTop: '2px' }}>{value}</div>
  </div>
)

const Home = () => {
  const { loading, generateReport, reports } = useInterview()
  
  // Safe Hook extraction fallback ke sath
  const authMethods = useAuth()
  const logoutFunction = authMethods?.handleLogout || authMethods?.logout || authMethods?.handleSignOut
  
  const { user, setUser } = useContext(AuthContext)
  const avatarInitial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'R')

  const [jobDescription, setJobDescription]   = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [fileName, setFileName]               = useState('')
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "HireFlow - Dashboard"
  }, [])

  const onLogoutClick = async () => {
    try {
      if (typeof logoutFunction === 'function') {
        await logoutFunction()
      }
      if(setUser) setUser(null)
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      navigate('/login', { replace: true })
    } catch (err) {
      console.error("Logout error:", err)
      navigate('/login', { replace: true })
    }
  }

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

  const interviewsCount = reports.length
  const avgScore = reports.length ? Math.round(reports.reduce((a, r) => a + r.matchScore, 0) / reports.length) : 0
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const thisWeekCount = reports.filter(r => new Date(r.createdAt) >= weekAgo).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: C.bg, fontFamily: 'inherit' }}>
      <style>{`
        * { box-sizing: border-box; }
        
        .premium-history-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .premium-history-btn:active {
          transform: translateY(1px);
        }
      `}</style>

      {/* Navbar area */}
      <header style={{ height: '92px', background: 'linear-gradient(to bottom, #110b24, #0e0a1a)', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                H
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ffffff' }}>Hire</span>
                <span style={{ color: '#e9d5ff', fontWeight: '300', marginLeft: '2px' }}>flow</span>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, padding: '5px 14px', borderRadius: '20px' }}>Dashboard</span>
          </div>

          {/* Logout button layout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '150px', justifyContent: 'flex-end' }}>
            <button 
              onClick={onLogoutClick} 
              style={{ 
                background: '#160933', 
                border: '1.5px solid #c026d3', 
                color: '#ffffff', 
                padding: '8px 18px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'block',
                visibility: 'visible',
                boxShadow: '0 0 10px rgba(192, 38, 211, 0.3)'
              }}
            >
              Logout
            </button>
            
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: C.pink, border: `2px solid ${C.pink}55` }}>
              {avatarInitial}
            </div>
          </div>

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
                style={{ width: '100%', flex: 1, resize: 'none', background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '18px', fontSize: '15px', color: C.text, fontFamily: 'inherit', outline: 'none', lineHeight: 1.55 }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: C.muted, marginTop: '4px', flexShrink: 0 }}>{jobDescription.length} / 5000</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '96%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Your profile</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px' }}>
                <label htmlFor="resume-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: `1px dashed ${C.cardBorder}`, borderRadius: '12px', background: C.cardBg, flex: 0.9, padding: '16px', cursor: 'pointer' }}>
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
                    style={{ width: '100%', flex: 1, resize: 'none', background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '16px', fontSize: '15px', color: C.text, fontFamily: 'inherit', outline: 'none', lineHeight: 1.55 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Row Bottom Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px', borderTop: `1px solid ${C.cardBorder}`, paddingTop: '16px', flexShrink: 0 }}>
            <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
              {reports.length > 0 && (
                /* 🔥 Updated: Exact dynamic solid gradient layout mirroring image_908f0a.png */
                <button 
                  type="button"
                  className="premium-history-btn"
                  onClick={() => navigate('/history')}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '12px 24px', 
                    borderRadius: '10px', 
                    border: 'none', 
                    background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, // Matched Solid Gradient Track
                    color: '#ffffff', 
                    fontSize: '14.5px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    letterSpacing: '0.2px',
                    boxShadow: `0 4px 16px ${C.glow}33`, // Balanced Bottom Neon Overlay Glow
                    transition: 'all 0.25s ease-in-out' 
                  }}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  View History
                </button>
              )}
            </div>
            
            <button
              onClick={handleGenerateReport}
              style={{ display: 'flex', alignItems: 'center', gap: '0px', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${C.glow}33`, flexShrink: 0 }}
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