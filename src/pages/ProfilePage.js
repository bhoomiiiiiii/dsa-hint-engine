import React from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const history = JSON.parse(localStorage.getItem(`dsa_history_${user?.username}`) || '[]');

  const stats = {
    total: history.length,
    easy: history.filter(h=>h.difficulty==='Easy').length,
    medium: history.filter(h=>h.difficulty==='Medium').length,
    hard: history.filter(h=>h.difficulty==='Hard').length,
    topTopics: getTopTopics(history),
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.profileCard}>
        <div style={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
        <div>
          <h2 style={styles.username}>{user?.username}</h2>
          <p style={styles.joined}>joined {user?.joinedAt ? format(new Date(user.joinedAt), 'MMM yyyy') : '—'}</p>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>$ logout</button>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Total Attempted" value={stats.total} color="var(--green)" />
        <StatCard label="Easy" value={stats.easy} color="var(--green)" />
        <StatCard label="Medium" value={stats.medium} color="var(--amber)" />
        <StatCard label="Hard" value={stats.hard} color="var(--red)" />
      </div>

      {stats.topTopics.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionTitle}>// Top Topics</p>
          <div style={styles.topicBars}>
            {stats.topTopics.map(([topic, count]) => (
              <div key={topic} style={styles.topicRow}>
                <span style={styles.topicName}>{topic}</span>
                <div style={styles.barWrap}>
                  <div style={{...styles.bar, width:`${Math.min((count/stats.total)*100,100)}%`}} />
                </div>
                <span style={styles.topicCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <p style={styles.sectionTitle}>// Recent Activity</p>
        {history.length === 0 ? (
          <p style={{fontSize:'12px',color:'var(--dim)'}}>// no activity yet — solve some problems!</p>
        ) : (
          [...history].reverse().slice(0,5).map(h => (
            <div key={h.id} style={styles.actRow}>
              <span style={{...styles.actDiff, color: h.difficulty==='Easy'?'var(--green)':h.difficulty==='Medium'?'var(--amber)':'var(--red)'}}>{h.difficulty[0]}</span>
              <span style={styles.actProblem}>{h.problem.slice(0,80)}...</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <p style={{fontSize:'10px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>{label}</p>
      <p style={{fontSize:'28px',fontWeight:'700',color}}>{value}</p>
    </div>
  );
}

function getTopTopics(history) {
  const counts = {};
  history.forEach(h => (h.topics||[]).forEach(t => { counts[t] = (counts[t]||0)+1; }));
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
}

const styles = {
  wrap: { padding:'24px', maxWidth:'700px', margin:'0 auto' },
  profileCard: { display:'flex', alignItems:'center', gap:'16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'20px', marginBottom:'20px' },
  avatar: { width:'52px', height:'52px', borderRadius:'50%', background:'var(--green-dim)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:'700', flexShrink:0 },
  username: { fontSize:'18px', fontWeight:'700', marginBottom:'2px' },
  joined: { fontSize:'11px', color:'var(--muted)' },
  logoutBtn: { marginLeft:'auto', padding:'7px 14px', background:'none', border:'1px solid var(--border2)', color:'var(--muted)', borderRadius:'5px', fontSize:'12px', cursor:'pointer' },
  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'20px' },
  statCard: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'14px' },
  section: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'16px', marginBottom:'16px' },
  sectionTitle: { fontSize:'11px', color:'var(--muted)', marginBottom:'14px', fontWeight:'700' },
  topicBars: { display:'flex', flexDirection:'column', gap:'8px' },
  topicRow: { display:'flex', alignItems:'center', gap:'10px' },
  topicName: { fontSize:'11px', color:'var(--text)', width:'100px', flexShrink:0 },
  barWrap: { flex:1, height:'6px', background:'var(--surface3)', borderRadius:'3px', overflow:'hidden' },
  bar: { height:'100%', background:'var(--green)', borderRadius:'3px', transition:'width 0.3s' },
  topicCount: { fontSize:'11px', color:'var(--muted)', width:'20px', textAlign:'right' },
  actRow: { display:'flex', alignItems:'center', gap:'10px', padding:'6px 0', borderBottom:'1px solid var(--border)' },
  actDiff: { fontSize:'10px', fontWeight:'700', width:'14px', flexShrink:0 },
  actProblem: { fontSize:'11px', color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
};
