import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'

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

const MockInterview = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const { report } = useInterview()

  // State trackers
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [showHint, setShowHint]     = useState(false)
  const [volume, setVolume]         = useState(25) 

  // Timer configuration
  const [timeLeft, setTimeLeft]   = useState(119) 
  const [timerRunning, setTimerRunning] = useState(false)

  // Modern Voice States
  const [isRecording, setIsRecording] = useState(false)
  const [testState, setTestState]     = useState('default') 

  // Evaluation Report control states
  const [answersHistory, setAnswersHistory] = useState([])
  const [showReport, setShowReport]         = useState(false)

  const questions = report?.technicalQuestions || [
    {
      question: "Can you explain the purpose and core functionalities of AWS EC2, S3, IAM, and VPC?",
      intention: "Assess foundational knowledge.",
      answer: "The candidate should define each service: EC2 (virtual servers for compute), S3 (object storage), IAM (identity and access management), and VPC (isolated virtual networks). They should explain their primary use cases and how they interact to form a basic cloud architecture."
    },
    {
      question: "How would you use Python to parse and extract specific data from a complex JSON structure, perhaps from an API response?",
      intention: "Evaluate basic cloud framework conceptual clarity.",
      answer: "The candidate should mention importing the 'json' module, using json.loads() or json.load(), and navigating the dictionary/list structure with keys and indices. Bonus points for handling potential KeyErrors or JSONDecodeErrors."
    },
    {
      question: "Explain Infrastructure as Code and how automation scripts change modern pipeline rollouts.",
      intention: "Check configuration management workflow systems.",
      answer: "IaC automates infrastructure setups via human-readable config files (like Ansible playbooks), removing configuration drift and manual execution errors."
    },
    {
      question: "Describe a situation where you would need to troubleshoot a network connectivity issue between an EC2 instance and an S3 bucket in AWS. What steps would you take?",
      intention: "Verify AWS networking, security groups, and troubleshooting depth.",
      answer: "Check VPC Endpoints routing tables, evaluate EC2 Security Group outbound rule constraints, check Network ACL boundaries, and audit IAM policy access permissions."
    }
  ]
  
  const currentQ = questions[currentIdx] || questions[0]
  const totalQ = questions.length

  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setTimerRunning(false)
    }
    return () => clearInterval(timer)
  }, [timerRunning, timeLeft])

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remSecs = secs % 60
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`
  }

  const handleSpeakToggle = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      setTestState('default')
    }
  }

  const handleTestVoice = () => {
    if (testState !== 'default') return
    setIsRecording(false)
    setTestState('listening')
    
    setTimeout(() => {
      setTestState('ready')
      setTimeout(() => {
        setTestState('default')
      }, 2500)
    }, 1500)
  }

  const processQuestionSubmission = () => {
    const userTokens = answerText.toLowerCase().trim()
    
    const filterWords = ['a', 'an', 'the', 'is', 'are', 'am', 'to', 'for', 'in', 'on', 'with', 'and', 'or', 'of']
    const cleanReference = currentQ.answer.toLowerCase().split(/[\s,.)(]+/).filter(w => w.length > 3 && !filterWords.includes(w))
    
    let matchCount = 0
    cleanReference.forEach(word => {
      if (userTokens.includes(word)) {
        matchCount++
      }
    })

    let score = 0
    if (userTokens.length > 3 && matchCount > 0) {
      score = Math.min(10, Math.floor((matchCount / cleanReference.length) * 12) + 2)
      if (userTokens.length > 40) score = Math.min(10, score + 1)
    }

    if (userTokens.length < 5 || matchCount === 0) {
      score = 0
    }

    let mistakeMessage = ""
    if (score === 0) {
      mistakeMessage = "CRITICAL ERROR: The submitted text contains no relevant engineering architectural concepts, definitions, or context keys. Evaluation logic graded this answer as completely invalid."
    } else if (score < 6) {
      mistakeMessage = "Lacked targeted framework terminology and operational architecture description details."
    } else {
      mistakeMessage = "Good baseline answer structure, but could introduce more precise cloud metric thresholds."
    }

    const record = {
      question: currentQ.question,
      userAns: answerText || '[No typed response recorded]',
      correctAns: currentQ.answer,
      score: score,
      mistakes: mistakeMessage,
    }

    const updatedHistory = [...answersHistory, record]
    setAnswersHistory(updatedHistory)

    if (currentIdx < totalQ - 1) {
      setCurrentIdx(prev => prev + 1)
      setAnswerText('')
      setShowHint(false)
    } else {
      setTimerRunning(false)
      setShowReport(true) 
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', padding: '0 0 40px 0', fontFamily: 'inherit' }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        @keyframes blinkAmber { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes subtleGlow { 0%, 100% { box-shadow: 0 0 8px rgba(192, 38, 211, 0.2); } 50% { box-shadow: 0 0 16px rgba(192, 38, 211, 0.4); } }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${C.cardBorder};
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${C.pink};
        }
      `}</style>

      {/* Top Header Section */}
      <header style={{ height: '92px', background: 'linear-gradient(to bottom, #110b24, #0e0a1a)', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', width: '100%', flexShrink: 0 }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo Alignment (🔥 Updated: Reset to all white text like image_907840.png) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '26px', fontWeight: '900', letterSpacing: '-0.8px' }}>
              <span style={{ color: '#ffffff' }}>Hire</span>
              <span style={{ color: '#e9d5ff', fontWeight: '300', marginLeft: '2px' }}>flow</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: `1.5px solid ${C.cardBorder}`, color: C.sub, padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
            <button onClick={() => navigate('/login', { replace: true })} style={{ background: '#160933', border: '1.5px solid #c026d3', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </header>

      {/* Structured Content Layout Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 0' }}>
        <div style={{ width: '100%', maxWidth: showReport ? '1140px' : '780px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'max-width 0.4s ease-in-out' }}>
          
          {/* ================= CONDITION 1: EVALUATION REPORT DISPLAY ================= */}
          {showReport ? (
            <div style={{ 
              background: C.cardBg, 
              border: `1.5px solid ${C.cardBorder}`, 
              borderRadius: '16px', 
              padding: '32px', 
              display: 'flex', 
              flexDirection: 'column', 
              height: 'calc(100vh - 165px)', 
              maxHeight: '700px',
              boxShadow: `0 0 32px rgba(0, 0, 0, 0.5)` 
            }}>
              
              <div style={{ flexShrink: 0, marginBottom: '20px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Interview Performance Blueprint</h2>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Review structural scoring and technical key responses below.</p>
              </div>

              {/* Scrollable Container (🔥 Updated: Button is now embedded inside this scrolling block at the bottom) */}
              <div className="custom-scrollbar" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}>
                {answersHistory.map((item, idx) => (
                  <div key={idx} style={{ background: '#090614', border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '15.5px', fontWeight: '700', color: C.sub }}>Q{idx + 1}: {item.question}</span>
                      <span style={{ 
                        background: item.score === 0 ? '#450a0a' : item.score >= 7 ? `${C.greenLight}` : '#3b1111', 
                        border: `1px solid ${item.score === 0 ? '#ef4444' : item.score >= 7 ? '#22c55e' : '#f87171'}`, 
                        color: item.score === 0 ? '#f87171' : item.score >= 7 ? C.greenText : '#fca5a5', 
                        padding: '6px 14px', 
                        borderRadius: '12px', 
                        fontSize: '13px', 
                        fontWeight: '800', 
                        whiteSpace: 'nowrap' 
                      }}>
                        Score: {item.score}/10
                      </span>
                    </div>

                    <div style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
                      <strong style={{ color: C.muted, display: 'block', marginBottom: '4px' }}>Your Answer:</strong>
                      <span style={{ color: C.text, wordBreak: 'break-word' }}>{item.userAns}</span>
                    </div>

                    <div style={{ fontSize: '13.5px', lineHeight: '1.55', background: item.score === 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)', borderLeft: '4px solid #ef4444', padding: '10px 14px', borderRadius: '6px' }}>
                      <strong style={{ color: '#f87171', display: 'block', marginBottom: '4px' }}>Identified Mistakes / Gaps:</strong>
                      <span style={{ color: '#fca5a5' }}>{item.mistakes}</span>
                    </div>

                    <div style={{ fontSize: '13.5px', lineHeight: '1.55', background: 'rgba(74, 222, 128, 0.04)', borderLeft: '4px solid #22c55e', padding: '10px 14px', borderRadius: '6px' }}>
                      <strong style={{ color: C.greenText, display: 'block', marginBottom: '4px' }}>Expected Correct Reference Architecture:</strong>
                      <span style={{ color: '#93c5fd' }}>{item.correctAns}</span>
                    </div>
                  </div>
                ))}

                {/* 🔥 Pushed to the absolute bottom of the scroll trajectory */}
                <button
                  onClick={() => navigate('/')}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '10px', marginBottom: '10px', flexShrink: 0 }}
                >
                  Return to Dashboard Overview
                </button>
              </div>

            </div>
          ) : (
            
            // ================= CONDITION 2: ACTIVE QUESTION SCREEN LAYOUT =================
            <>
              {/* Progress Tracker Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: C.muted, marginBottom: '6px', fontWeight: 600 }}>
                  <span>Question {currentIdx + 1} of {totalQ}</span>
                  <span>{Math.round(((currentIdx) / totalQ) * 100)}% done</span>
                </div>
                <div style={{ width: '100%', height: '3px', background: C.cardBorder, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${((currentIdx + 1) / totalQ) * 100}%`, height: '100%', background: C.pink, transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Content Question Card */}
              <div style={{ background: C.cardBg, border: `1.5px solid ${C.cardBorder}`, borderRadius: '14px', padding: '20px 24px', boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}>
                <p style={{ fontSize: '15px', color: C.text, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {currentQ.question}
                </p>
              </div>

              {/* Action controls block */}
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: `3.5px solid ${timerRunning ? C.pink : C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: C.text }}>
                    {formatTime(timeLeft)}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setTimerRunning(!timerRunning)} style={{ background: C.pink, color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}>
                      {timerRunning ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={() => { setTimerRunning(false); setTimeLeft(120); }} style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.cardBorder}`, padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer' }}>
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[60, 120, 180, 300].map((sec) => (
                    <button key={sec} onClick={() => { setTimeLeft(sec); setTimerRunning(false); }} style={{ background: timeLeft === sec ? `${C.pink}22` : 'transparent', border: `1px solid ${timeLeft === sec ? C.pink : C.cardBorder}`, color: timeLeft === sec ? C.text : C.muted, padding: '5px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>
                      {sec / 60}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Workspace Block */}
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSpeakToggle} style={{ background: isRecording ? '#3b1111' : 'transparent', border: `1.5px solid ${isRecording ? '#ef4444' : C.cardBorder}`, color: isRecording ? '#f87171' : C.text, padding: '6px 14px', borderRadius: '16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', animation: isRecording ? 'pulseRed 1.5s infinite' : 'none', transition: 'all 0.2s ease' }}>
                      {isRecording ? 'RECORDING' : 'Speak'}
                    </button>

                    <button onClick={handleTestVoice} disabled={testState !== 'default'} style={{ background: testState === 'ready' ? C.greenLight : testState === 'listening' ? `${C.pink}18` : 'transparent', border: `1.5px solid ${testState === 'ready' ? '#22c55e' : testState === 'listening' ? C.pink : C.cardBorder}`, color: testState === 'ready' ? C.greenText : testState === 'listening' ? '#fcd34d' : C.muted, padding: '6px 14px', borderRadius: '16px', fontSize: '12.5px', fontWeight: 600, transition: 'all 0.2s ease' }}>
                      {testState === 'ready' ? 'MIC READY' : testState === 'listening' ? 'LISTENING...' : 'Test voice'}
                    </button>
                  </div>

                  <button onClick={() => setShowHint(!showHint)} style={{ background: showHint ? `linear-gradient(135deg, ${C.pinkLight}, ${C.pink})` : 'transparent', border: `1.5px solid ${C.pink}`, color: '#ffffff', padding: '7px 18px', borderRadius: '16px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease', animation: showHint ? 'none' : 'subtleGlow 3s infinite ease-in-out' }}>
                    Need Hint
                  </button>
                </div>

                {showHint && (
                  <div style={{ background: `${C.pink}11`, border: `1px solid ${C.pink}33`, borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: C.sub, lineHeight: 1.5 }}>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Advice Focus:</strong>
                    {currentQ.intention}
                  </div>
                )}

                <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder={isRecording ? "Listening to your microphone... Start speaking now!" : "Type your answer here..."} rows={5} style={{ width: '100%', background: '#090614', border: `1px solid ${isRecording ? '#ef444455' : C.cardBorder}`, borderRadius: '10px', padding: '14px', fontSize: '14px', color: C.text, resize: 'none', outline: 'none', lineHeight: 1.55 }} />

                <button
                  onClick={processQuestionSubmission}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 16px ${C.glow}33` }}
                >
                  {currentIdx < totalQ - 1 ? 'Submit answer & Next' : 'Finish Mock Interview'}
                </button>
              </div>

              {/* Compact Volume Control Slider */}
              <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', alignSelf: 'center', minWidth: '220px' }}>
                <span style={{ fontSize: '13px', color: C.muted }}>🔊</span>
                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ accentColor: C.pink, cursor: 'pointer', height: '4px' }} />
                <span style={{ fontSize: '12px', color: C.text, fontWeight: 600, width: '20px' }}>{volume}</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default MockInterview