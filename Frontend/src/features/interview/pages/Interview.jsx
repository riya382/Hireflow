import React, { useState, useEffect, useContext } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { AuthContext } from '../../auth/auth.context.jsx'
import { useAuth } from '../../auth/hooks/useAuth.js' 

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

const NAV_ITEMS = [
  {
    id: 'technical', label: 'Technical Questions',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  },
  {
    id: 'behavioral', label: 'Behavioral Questions',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  {
    id: 'roadmap', label: 'Road Map',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>,
  },
]

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: C.cardBg, borderRadius: '14px',
      border: `1px solid ${open ? C.pink : C.cardBorder}`,
      overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s',
      width: '100%', marginBottom: '10px',
      boxShadow: open ? `0 0 20px ${C.glow}30` : 'none',
    }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 20px', cursor: 'pointer' }}>
        <span style={{
          minWidth: '32px', height: '32px', borderRadius: '10px',
          background: open ? C.pink : `${C.pink}22`,
          color: open ? '#fff' : C.sub,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, flexShrink: 0,
          boxShadow: open ? `0 0 10px ${C.glow}66` : 'none',
          transition: 'all 0.2s',
        }}>Q{index + 1}</span>
        <p style={{ flex: 1, fontSize: '14px', color: C.text, margin: 0, lineHeight: 1.6, paddingTop: '5px' }}>{item.question}</p>
        <span style={{ color: C.pink, transition: 'transform 0.2s', flexShrink: 0, marginTop: '7px', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.cardBorder}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: C.sub, background: `${C.pink}22`, padding: '3px 9px', borderRadius: '20px' }}>Intention</span>
            <p style={{ fontSize: '13px', color: C.muted, marginTop: '10px', lineHeight: 1.7 }}>{item.intention}</p>
          </div>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: C.greenText, background: C.greenLight, padding: '3px 9px', borderRadius: '20px' }}>Model Answer</span>
            <p style={{ fontSize: '13px', color: C.muted, marginTop: '10px', lineHeight: 1.7 }}>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const QuestionList = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {items?.map((q, i) => <QuestionCard key={i} item={q} index={i} />) || <p style={{ color: C.muted }}>No questions available.</p>}
  </div>
)

const RoadMapDay = ({ day }) => (
  <div style={{ background: C.cardBg, borderRadius: '14px', border: `1px solid ${C.cardBorder}`, padding: '18px 20px', marginBottom: '10px', borderLeft: `4px solid ${C.pink}`, boxShadow: `0 0 16px ${C.glow}18` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <span style={{ background: C.pink, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, boxShadow: `0 0 10px ${C.glow}55` }}>Day {day.day}</span>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: 0 }}>{day.focus}</h3>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {day.tasks?.map((task, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.pink, flexShrink: 0, marginTop: '6px', boxShadow: `0 0 6px ${C.glow}` }} />
          {task}
        </li>
      ))}
    </ul>
  </div>
)

const ScoreRing = ({ score }) => {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - (score || 0) / 100)
  const color = score >= 80 ? C.greenText : score >= 60 ? '#fcd34d' : C.pink
  return (
    <div style={{ position: 'relative', width: '130px', height: '130px' }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <defs><filter id="scoreGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <circle cx="65" cy="65" r={r} fill="none" stroke={C.cardBorder} strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          filter="url(#scoreGlow)"
        />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700, color: C.text }}>{score || 0}</div>
        <div style={{ fontSize: '11px', color: C.muted }}>%</div>
      </div>
    </div>
  )
}

const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical')
  const [expandedGapIndex, setExpandedGapIndex] = useState(null)
  const [fetchError, setFetchError] = useState(false)

  const { report, getReportById, loading } = useInterview()
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const authMethods = useAuth()
  const logoutFunction = authMethods?.handleLogout || authMethods?.logout || authMethods?.handleSignOut
  const { user, setUser } = useContext(AuthContext)
  const avatarInitial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'R')

  useEffect(() => { 
    if (interviewId) {
      getReportById(interviewId).catch((err) => {
        console.error("Failed loading blueprint:", err);
        setFetchError(true);
      });
    } 
  }, [interviewId])

  useEffect(() => {
    document.title = "HireFlow - AI Interview Strategy"
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
      console.error("Logout process failed:", err)
      navigate('/login', { replace: true })
    }
  }

  if (fetchError) {
    return (
      <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '18px', color: '#ef4444', fontWeight: 600 }}>Backend Failed to load your Strategy (Status 500)</p>
        <button onClick={() => navigate('/')} style={{ background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
          Go Back to Dashboard
        </button>
      </div>
    )
  }

  if (loading || !report) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${C.cardBorder}`, borderTopColor: C.pink, animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: '16px', color: C.muted }}>Loading your interview blueprint...</p>
      </div>
    )
  }

  const severityColor = (sev) => {
    if (sev === 'high')   return { bg: C.amberLight,   text: '#fcd34d' }
    if (sev === 'medium') return { bg: `${C.pink}18`, text: C.sub }
    return                               { bg: C.greenLight,  text: C.greenText }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '0', display: 'flex', flexDirection: 'column' }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <header style={{ height: '92px', background: 'linear-gradient(to bottom, #110b24, #0e0a1a)', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                H
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#ffffff' }}>Hire</span>
                <span style={{ color: '#e9d5ff', fontWeight: '300', marginLeft: '2px' }}>flow</span>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, padding: '5px 14px', borderRadius: '20px' }}>Strategy</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '220px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'transparent', border: `1.5px solid ${C.cardBorder}`, color: C.sub, padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Dashboard
            </button>

            <button 
              onClick={onLogoutClick} 
              style={{ background: '#160933', border: '1.5px solid #c026d3', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Logout
            </button>

            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: C.pink, border: `2px solid ${C.pink}55`, flexShrink: 0 }}>
              {avatarInitial}
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '220px 1fr 250px', padding: '28px 20px', gap: '20px', minHeight: 0 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: C.muted, marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Sections</p>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', background: activeNav === item.id ? `${C.pink}22` : 'transparent', color: activeNav === item.id ? C.sub : C.muted, fontSize: '13px', fontWeight: activeNav === item.id ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span style={{ color: activeNav === item.id ? C.pink : C.muted }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingBottom: '16px' }}>
            {/* 🔥 Removed Download Resume Button from here */}
            <button onClick={() => navigate(`/mock-interview/${interviewId}`)} style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', background: 'transparent', color: C.sub, border: `1.5px solid ${C.pink}`, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Start Mock Interview</button>
          </div>
        </nav>

        <main style={{ overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: 0 }}>
              {activeNav === 'technical' && 'Technical Questions'}
              {activeNav === 'behavioral' && 'Behavioral Questions'}
              {activeNav === 'roadmap' && 'Preparation Road Map'}
            </h2>
            <span style={{ background: `${C.pink}22`, color: C.sub, padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, border: `1px solid ${C.pink}44` }}>
              {activeNav === 'technical' && `${report.technicalQuestions?.length || 0} questions`}
              {activeNav === 'behavioral' && `${report.behavioralQuestions?.length || 0} questions`}
              {activeNav === 'roadmap' && `${report.preparationPlan?.length || 0}-day plan`}
            </span>
          </div>
          {activeNav === 'technical' && <QuestionList items={report.technicalQuestions} />}
          {activeNav === 'behavioral' && <QuestionList items={report.behavioralQuestions} />}
          {activeNav === 'roadmap' && report.preparationPlan?.map((day) => <RoadMapDay key={day.day} day={day} />)}
        </main>

        <aside style={{ borderLeft: `1px solid ${C.cardBorder}`, paddingLeft: '16px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${C.cardBorder}` }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>Match Score</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><ScoreRing score={report.matchScore} /></div>
            <p style={{ fontSize: '12px', color: report.matchScore >= 80 ? C.greenText : '#fcd34d', fontWeight: 500 }}>
              {report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Good match' : 'Partial match'}
            </p>
          </div>
          
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Skill Gaps</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.skillGaps?.map((gap, i) => {
                const isGapOpen = expandedGapIndex === i
                const { bg, text } = severityColor(gap.severity)
                
                return (
                  <div key={i} onClick={() => setExpandedGapIndex(isGapOpen ? null : i)} style={{ background: bg, borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', border: isGapOpen ? `1px solid ${C.pink}` : '1px solid transparent', transition: 'all 0.15s ease-in-out', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', width: '100%' }}>
                      <span style={{ color: text, fontSize: '12.5px', fontWeight: 600, lineHeight: 1.3 }}>{gap.skill}</span>
                      <span style={{ color: text, fontSize: '10px', transform: isGapOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                    </div>
                    {isGapOpen && (
                      <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.6', paddingTop: '10px', borderTop: `1px solid ${text}33`, marginTop: '8px' }}>
                        <span style={{ fontWeight: 700, color: C.sub, display: 'block', marginBottom: '6px' }}>💡 Recommendation:</span>
                        {gap.solution || gap.recommendation || `Optimize core benchmarks for ${gap.skill}.`}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Interview