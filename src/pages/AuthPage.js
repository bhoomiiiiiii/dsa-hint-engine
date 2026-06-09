import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();

  const handle = () => {
    if (!username.trim() || !password.trim()) {
      toast.error('fill both fields', { className: 'toast-error' });
      return;
    }
    const result = mode === 'login' ? login(username, password) : signup(username, password);
    if (result.error) toast.error(result.error, { className: 'toast-error' });
    else toast.success(mode === 'login' ? `welcome back, ${username}` : `account created!`, { className: 'toast-success' });
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.terminal}>
        <div style={styles.bar}>
          <div style={styles.dots}>
            <span style={{...styles.dot, background:'#ff5f57'}}/>
            <span style={{...styles.dot, background:'#febc2e'}}/>
            <span style={{...styles.dot, background:'#27c840'}}/>
          </div>
          <span style={styles.barTitle}>dsa-hint-engine — auth.sh</span>
        </div>

        <div style={styles.body}>
          <div style={styles.ascii}>
{`  ██████╗ ███████╗ █████╗ 
  ██╔══██╗██╔════╝██╔══██╗
  ██║  ██║███████╗███████║
  ██║  ██║╚════██║██╔══██║
  ██████╔╝███████║██║  ██║
  ╚═════╝ ╚══════╝╚═╝  ╚═╝`}
          </div>
          <p style={styles.tagline}>// DSA Hint Engine — think before you peek</p>

          <div style={styles.tabRow}>
            {['login','signup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{...styles.tab, ...(mode===m ? styles.tabActive : {})}}>
                {m === 'login' ? '$ login' : '$ signup'}
              </button>
            ))}
          </div>

          <div style={styles.form}>
            <label style={styles.label}>username</label>
            <input style={styles.input} value={username} onChange={e=>setUsername(e.target.value)}
              placeholder="your_username" onKeyDown={e=>e.key==='Enter'&&handle()} />

            <label style={styles.label}>password</label>
            <input style={styles.input} type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handle()} />

            <button style={styles.btn} onClick={handle}>
              <span style={{color:'#0a1a0f'}}>▶ {mode === 'login' ? 'Login' : 'Create Account'}</span>
            </button>
          </div>

          <p style={styles.hint}>
            {mode==='login' ? "no account? " : "have an account? "}
            <span style={{color:'var(--green)',cursor:'pointer'}} onClick={()=>setMode(mode==='login'?'signup':'login')}>
              {mode==='login' ? 'signup →' : 'login →'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', background:'var(--bg)' },
  terminal: { width:'100%', maxWidth:'440px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'10px', overflow:'hidden' },
  bar: { display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', background:'var(--surface2)', borderBottom:'1px solid var(--border)' },
  dots: { display:'flex', gap:'6px' },
  dot: { width:'11px', height:'11px', borderRadius:'50%', display:'block' },
  barTitle: { fontSize:'12px', color:'var(--muted)', flex:1, textAlign:'center' },
  body: { padding:'28px 28px 24px' },
  ascii: { fontFamily:'JetBrains Mono', fontSize:'9px', color:'var(--green)', lineHeight:1.4, marginBottom:'12px', whiteSpace:'pre' },
  tagline: { fontSize:'11px', color:'var(--muted)', marginBottom:'24px' },
  tabRow: { display:'flex', gap:'8px', marginBottom:'20px' },
  tab: { padding:'6px 16px', background:'transparent', border:'1px solid var(--border2)', color:'var(--muted)', borderRadius:'5px', fontSize:'12px', transition:'all 0.15s' },
  tabActive: { borderColor:'var(--green)', color:'var(--green)', background:'var(--green-dim)' },
  form: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'10px', color:'var(--dim)', textTransform:'uppercase', letterSpacing:'0.08em' },
  input: { padding:'9px 12px', fontSize:'13px', borderRadius:'5px', background:'var(--surface2)', border:'1px solid var(--border2)', color:'var(--text)', outline:'none' },
  btn: { marginTop:'8px', padding:'11px', background:'var(--green)', border:'none', borderRadius:'5px', fontSize:'13px', fontWeight:'700', cursor:'pointer', transition:'all 0.15s' },
  hint: { marginTop:'16px', fontSize:'11px', color:'var(--dim)', textAlign:'center' },
};
