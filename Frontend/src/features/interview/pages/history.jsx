import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';

const C = {
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#8878a8',
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  sub:        '#d8b4fe',
  greenLight: '#052e16',
  greenText:  '#4ade80',
  amberLight: '#1c1004',
};

const History = () => {
  const navigate = useNavigate();
  const { reports, loading } = useInterview();
  const [localReports, setLocalReports] = useState([]);

  // Sync local state with hook reports
  useEffect(() => {
    if (reports) {
      setLocalReports(reports);
    }
  }, [reports]);

  const scoreStyle = (s) =>
    s >= 80 ? { bg: C.greenLight, text: C.greenText } :
    s >= 60 ? { bg: C.amberLight, text: '#fcd34d' } :
              { bg: `${C.pink}22`, text: C.sub };

  // 🔥 Instant Item Deletion Handler (No more confirmation popup)
  const handleDeleteItem = (e, id) => {
    e.stopPropagation(); // Stops card from navigating when clicking delete button
    setLocalReports(prev => prev.filter(report => report._id !== id));
    
    // Optional: If you need to sync deletion with backend database later:
    // axios.delete(`/api/reports/${id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: C.bg, padding: '40px', alignItems: 'center', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.cardBorder}`, paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>Interview History</h1>
            <p style={{ fontSize: '13.5px', color: C.muted, margin: '4px 0 0' }}>Review or manage your past generated interview blueprints.</p>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            style={{ background: '#160933', border: '1.5px solid #c026d3', color: '#ffffff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <p style={{ color: C.muted, textAlign: 'center' }}>Loading your history...</p>
        ) : localReports && localReports.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {localReports.map((report) => (
              <div 
                key={report._id} 
                onClick={() => navigate(`/interview/${report._id}`)}
                style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '10px', padding: '14px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = C.pink}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = C.cardBorder}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </span>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>{report.title || 'Untitled Position'}</h3>
                    <span style={{ fontSize: '12px', color: C.muted }}>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recent Session'}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, padding: '5px 12px', borderRadius: '6px', background: scoreStyle(report.matchScore).bg, color: scoreStyle(report.matchScore).text }}>
                    {report.matchScore}% match
                  </span>
                  
                  {/* Individual Delete Button */}
                  <button 
                    onClick={(e) => handleDeleteItem(e, report._id)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#270e0e'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    title="Delete this item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: C.muted, fontSize: '15px', margin: 0 }}>No previous interview sessions found.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;