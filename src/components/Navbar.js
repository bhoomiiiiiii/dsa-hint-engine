import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const navItems = [
    { label: 'Editor', path: '/' },
    { label: 'History', path: '/history' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.dots}>
          <span style={{...styles.dot, background:'#ff5f57'}}/>
          <span style={{...styles.dot, background:'#febc2e'}}/>
          <span style={{...styles.dot, background:'#27c840'}}/>
        </div>
        <span style={styles.logo}>dsa<span style={{color:'var(--green)'}}>.</span>hint</span>
      </div>

      <div style={styles.tabs}>
        {navItems.map(n => (
          <button key={n.path} onClick={()=>navigate(n.path)}
            style={{...styles.tab, ...(loc.pathname===n.path?styles.tabActive:{})}}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={styles.right}>
        <span style={styles.userChip}>
          <span style={styles.userDot}/>
          {user?.username}
        </span>
      </div>
    </div>
  );
}

const styles = {
  nav: { display:'flex', alignItems:'center', gap:'12px', padding:'0 16px', height:'44px', background:'var(--surface)', borderBottom:'1px solid var(--border)', flexShrink:0 },
  left: { display:'flex', alignItems:'center', gap:'10px' },
  dots: { display:'flex', gap:'5px' },
  dot: { width:'10px', height:'10px', borderRadius:'50%', display:'block' },
  logo: { fontSize:'13px', fontWeight:'700', color:'var(--text)', letterSpacing:'-0.02em' },
  tabs: { display:'flex', gap:'2px', flex:1, justifyContent:'center' },
  tab: { padding:'5px 14px', background:'none', border:'none', color:'var(--muted)', fontSize:'12px', borderRadius:'5px', cursor:'pointer', transition:'all 0.15s' },
  tabActive: { background:'var(--surface3)', color:'var(--green)' },
  right: { marginLeft:'auto' },
  userChip: { display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'var(--muted)' },
  userDot: { width:'7px', height:'7px', borderRadius:'50%', background:'var(--green)', display:'block' },
};
