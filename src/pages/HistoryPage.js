import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');

  const history = JSON.parse(localStorage.getItem(`dsa_history_${user?.username}`) || '[]');
  const filtered = filter === 'All' ? history : history.filter(h => h.difficulty === filter);

  const deleteEntry = (id) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(`dsa_history_${user?.username}`, JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}><span style={{color:'var(--green)'}}>//</span> Problem History</h1>
        <p style={styles.sub}>{history.length} problems attempted</p>
      </div>

      <div style={styles.filters}>
        {['All','Easy','Medium','Hard'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            style={{...styles.filterBtn, ...(filter===f?styles.filterActive:{})}}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p style={{color:'var(--muted)'}}>// no problems yet</p>
          <p style={{color:'var(--dim)',marginTop:'6px'}}>// solve some problems and they'll appear here</p>
        </div>
      ) : (
        <div style={styles.list}>
          {[...filtered].reverse().map(h => (
            <div key={h.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={{...styles.diffBadge, ...styles[`diff${h.difficulty}`]}}>{h.difficulty}</span>
                <span style={styles.lang}>{h.language}</span>
                <span style={styles.time}>{formatDistanceToNow(new Date(h.createdAt), {addSuffix:true})}</span>
                <button onClick={()=>deleteEntry(h.id)} style={styles.del}>✕</button>
              </div>
              <p style={styles.problemText}>{h.problem.slice(0, 200)}{h.problem.length > 200 ? '...' : ''}</p>
              {h.topics?.length > 0 && (
                <div style={styles.tags}>
                  {h.topics.map(t => <span key={t} style={styles.tag}>{t}</span>)}
                </div>
              )}
              <p style={styles.hintCount}>depth {h.depth} hints requested</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding:'24px', maxWidth:'800px', margin:'0 auto' },
  header: { marginBottom:'20px' },
  title: { fontSize:'20px', fontWeight:'700', marginBottom:'4px' },
  sub: { fontSize:'12px', color:'var(--muted)' },
  filters: { display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' },
  filterBtn: { padding:'6px 14px', borderRadius:'100px', fontSize:'12px', border:'1px solid var(--border2)', background:'none', color:'var(--muted)', transition:'all 0.15s' },
  filterActive: { background:'var(--green-dim)', color:'var(--green)', borderColor:'var(--green)' },
  empty: { textAlign:'center', padding:'60px 20px', fontSize:'13px' },
  list: { display:'flex', flexDirection:'column', gap:'12px' },
  card: { background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'14px 16px' },
  cardTop: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' },
  diffBadge: { fontSize:'10px', padding:'2px 8px', borderRadius:'3px', fontWeight:'700' },
  diffEasy: { background:'var(--green-dim)', color:'var(--green)' },
  diffMedium: { background:'var(--amber-dim)', color:'var(--amber)' },
  diffHard: { background:'var(--red-dim)', color:'var(--red)' },
  lang: { fontSize:'10px', color:'var(--cyan)', background:'var(--cyan-dim)', padding:'2px 8px', borderRadius:'3px' },
  time: { fontSize:'10px', color:'var(--dim)', marginLeft:'auto' },
  del: { background:'none', border:'none', color:'var(--muted)', fontSize:'12px', cursor:'pointer', padding:'2px 6px' },
  problemText: { fontSize:'12px', color:'var(--muted)', lineHeight:1.7, marginBottom:'8px', fontFamily:"'Bricolage Grotesque',sans-serif" },
  tags: { display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'8px' },
  tag: { fontSize:'10px', padding:'2px 7px', borderRadius:'3px', background:'var(--purple-dim)', color:'var(--purple)', border:'1px solid var(--purple)' },
  hintCount: { fontSize:'10px', color:'var(--dim)' },
};
