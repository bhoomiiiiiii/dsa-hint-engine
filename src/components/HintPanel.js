import React from 'react';

export default function HintPanel({ content, loading, error }) {
  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <span>thinking...</span>
    </div>
  );

  if (error) return (
    <div style={styles.errorBlock}>
      <p style={{color:'var(--red)',marginBottom:'8px'}}>// error: {error}</p>
      <p style={{color:'var(--muted)'}}>// make sure REACT_APP_GROQ_API_KEY is set in .env</p>
    </div>
  );

  if (!content) return (
    <div style={styles.idle}>
      <span style={{color:'var(--green)'}}>$ </span>paste a problem above and click "Get Hints"<br/>
      <span style={{color:'var(--green)'}}>$ </span>hints appear here — no spoilers, just direction<br/>
      <span style={{color:'var(--dim)'}}>_</span>
    </div>
  );

  const sections = content.split(/(?=###\s)/).filter(s => s.trim());
  const blockStyles = ['hint','info','warn','hard'];

  return (
    <div>
      {sections.map((sec, i) => {
        const lines = sec.trim().split('\n');
        const heading = lines[0].replace(/^###\s*/, '').trim();
        const body = lines.slice(1).join('\n').trim();
        const type = blockStyles[i % blockStyles.length];
        return (
          <div key={i} style={{...styles.block, ...styles[type]}}>
            <p style={{...styles.blockHead, ...styles[`${type}Head`]}}>{heading}</p>
            <div style={styles.blockBody} dangerouslySetInnerHTML={{__html: formatText(body)}} />
          </div>
        );
      })}
    </div>
  );
}

function formatText(t) {
  return t
    .replace(/`([^`]+)`/g, '<code style="font-family:JetBrains Mono,monospace;background:#202026;padding:2px 5px;border-radius:3px;font-size:11px;color:#3ddc84;">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

const styles = {
  idle: { color:'var(--dim)', fontSize:'12px', lineHeight:2 },
  loading: { display:'flex', alignItems:'center', gap:'8px', color:'var(--muted)', fontSize:'12px' },
  spinner: {
    width:'14px', height:'14px',
    border:'2px solid var(--border2)',
    borderTop:'2px solid var(--green)',
    borderRadius:'50%',
    animation:'spin 0.8s linear infinite',
  },
  errorBlock: { padding:'12px', background:'var(--red-dim)', borderRadius:'6px', borderLeft:'3px solid var(--red)', fontSize:'12px' },
  block: { marginBottom:'14px', padding:'10px 14px', borderRadius:'6px', borderLeft:'3px solid var(--green)' },
  hint: { background:'var(--green-dim)', borderColor:'var(--green)' },
  info: { background:'var(--cyan-dim)', borderColor:'var(--cyan)' },
  warn: { background:'var(--amber-dim)', borderColor:'var(--amber)' },
  hard: { background:'var(--purple-dim)', borderColor:'var(--purple)' },
  blockHead: { fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px', fontWeight:'700' },
  hintHead: { color:'var(--green)' },
  infoHead: { color:'var(--cyan)' },
  warnHead: { color:'var(--amber)' },
  hardHead: { color:'var(--purple)' },
  blockBody: { fontSize:'12px', color:'var(--text)', lineHeight:1.8, fontFamily:"'Bricolage Grotesque', sans-serif" },
};
