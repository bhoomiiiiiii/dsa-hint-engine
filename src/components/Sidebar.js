import React from 'react';

const TOPICS = ['Array','String','DP','Graph','Tree','Stack','Queue','HashMap','Binary Search','Sliding Window','Two Pointer','Greedy','Backtracking','Bit Manipulation'];

export default function Sidebar({ difficulty, setDifficulty, language, setLanguage, depth, setDepth, selTopics, setSelTopics }) {
  const toggleTopic = (t) => setSelTopics(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);

  return (
    <div style={styles.sidebar}>
      <Section title="Difficulty">
        {['Easy','Medium','Hard'].map(d => (
          <button key={d} onClick={()=>setDifficulty(d)}
            style={{...styles.diffBtn, ...(difficulty===d ? styles[`diff${d}`] : {})}}>
            <span>{d==='Easy'?'🟢':d==='Medium'?'🟡':'🔴'}</span> {d}
          </button>
        ))}
      </Section>

      <Divider />

      <Section title="Language">
        <select value={language} onChange={e=>setLanguage(e.target.value)} style={styles.select}>
          {['Java','Python','C++','JavaScript','Go','Rust'].map(l=>(
            <option key={l}>{l}</option>
          ))}
        </select>
      </Section>

      <Divider />

      <Section title="Hint Depth">
        <p style={styles.depthLabel}>
          {depth===1?'Level 1 — gentle nudge':depth===2?'Level 2 — approach hint':'Level 3 — detailed walkthrough'}
        </p>
        <div style={styles.depthDots}>
          {[1,2,3].map(n => (
            <div key={n} onClick={()=>setDepth(n)}
              style={{...styles.depthDot,
                background: n<=depth ? (depth===1?'var(--green)':depth===2?'var(--amber)':'var(--red)') : 'var(--surface3)',
                borderColor: n<=depth ? (depth===1?'var(--green)':depth===2?'var(--amber)':'var(--red)') : 'var(--border2)',
              }} title={['Nudge','Approach','Detailed'][n-1]} />
          ))}
        </div>
      </Section>

      <Divider />

      <Section title="Topic Tags">
        <div style={styles.topics}>
          {TOPICS.map(t => (
            <button key={t} onClick={()=>toggleTopic(t)}
              style={{...styles.chip, ...(selTopics.includes(t)?styles.chipSel:{})}}>
              {t}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{padding:'12px'}}>
      <p style={{fontSize:'10px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>{title}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{height:'1px',background:'var(--border)',margin:'0 12px'}} />;
}

const styles = {
  sidebar: { width:'210px', background:'var(--surface)', borderRight:'1px solid var(--border)', flexShrink:0, overflowY:'auto', display:'flex', flexDirection:'column' },
  diffBtn: { display:'flex', alignItems:'center', gap:'6px', width:'100%', textAlign:'left', padding:'7px 10px', borderRadius:'5px', fontSize:'12px', cursor:'pointer', border:'none', background:'none', color:'var(--muted)', transition:'all 0.15s', marginBottom:'2px' },
  diffEasy: { background:'var(--green-dim)', color:'var(--green)', borderLeft:'3px solid var(--green)' },
  diffMedium: { background:'var(--amber-dim)', color:'var(--amber)', borderLeft:'3px solid var(--amber)' },
  diffHard: { background:'var(--red-dim)', color:'var(--red)', borderLeft:'3px solid var(--red)' },
  select: { width:'100%', padding:'7px 8px', fontSize:'12px', borderRadius:'5px', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)' },
  depthLabel: { fontSize:'10px', color:'var(--muted)', marginBottom:'8px' },
  depthDots: { display:'flex', gap:'5px' },
  depthDot: { width:'30px', height:'6px', borderRadius:'3px', cursor:'pointer', border:'1px solid', transition:'all 0.15s' },
  topics: { display:'flex', flexWrap:'wrap', gap:'4px' },
  chip: { fontSize:'10px', padding:'3px 7px', borderRadius:'3px', cursor:'pointer', border:'1px solid var(--border2)', color:'var(--muted)', background:'none', transition:'all 0.15s' },
  chipSel: { background:'var(--purple-dim)', color:'var(--purple)', borderColor:'var(--purple)' },
};
