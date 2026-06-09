import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import HintPanel from '../components/HintPanel';
import { useAuth } from '../context/AuthContext';
import { callGroq, buildHintPrompt, buildComplexityPrompt, buildApproachPrompt } from '../hooks/useGroq';

const PANELS = ['HINTS', 'COMPLEXITY', 'APPROACH', 'CODE'];

export default function EditorPage() {
  const { user } = useAuth();
  const [problem, setProblem] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [language, setLanguage] = useState('Java');
  const [depth, setDepth] = useState(1);
  const [selTopics, setSelTopics] = useState([]);
  const [activePanel, setActivePanel] = useState('HINTS');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ HINTS: null, COMPLEXITY: null, APPROACH: null });
  const [errors, setErrors] = useState({});
  const [code, setCode] = useState('// write your solution here\n\n');

  const lineCount = Math.max(problem.split('\n').length, 8);

  const saveToHistory = () => {
    if (!user) return;
    const key = `dsa_history_${user.username}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    history.push({
      id: Date.now(),
      problem,
      difficulty,
      language,
      depth,
      topics: selTopics,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(history));
  };

  const getHints = async () => {
    if (!problem.trim()) {
      toast.error('paste a problem first', { className: 'toast-error' });
      return;
    }
    setLoading(true);
    setErrors({});
    setResults({ HINTS: null, COMPLEXITY: null, APPROACH: null });
    try {
      const [hints, complexity, approach] = await Promise.all([
        callGroq(buildHintPrompt(problem, difficulty, depth, language, selTopics)),
        callGroq(buildComplexityPrompt(problem)),
        callGroq(buildApproachPrompt(problem, difficulty, language)),
      ]);
      setResults({ HINTS: hints, COMPLEXITY: complexity, APPROACH: approach });
      saveToHistory();
      toast.success('hints ready!', { className: 'toast-success' });
    } catch (e) {
      setErrors({ HINTS: e.message, COMPLEXITY: e.message, APPROACH: e.message });
      toast.error(e.message, { className: 'toast-error' });
    }
    setLoading(false);
  };

  const clearAll = () => {
    setProblem('');
    setResults({ HINTS: null, COMPLEXITY: null, APPROACH: null });
    setErrors({});
  };

  return (
    <div style={styles.page}>
      {/* LEFT SIDEBAR */}
      <Sidebar
        difficulty={difficulty} setDifficulty={setDifficulty}
        language={language} setLanguage={setLanguage}
        depth={depth} setDepth={setDepth}
        selTopics={selTopics} setSelTopics={setSelTopics}
      />

      {/* RIGHT: editor + output stacked */}
      <div style={styles.right}>

        {/* TOP: problem input */}
        <div style={styles.topSection}>
          <div style={styles.codeHeader}>
            <span style={styles.fileTag}>// paste your <span style={{color:'var(--cyan)'}}>problem statement</span></span>
            <span style={styles.charCount}>{problem.length} chars · {lineCount} lines</span>
          </div>
          <div style={styles.textWrap}>
            <div style={styles.lineNums}>
              {Array.from({length: lineCount}, (_, i) => (
                <div key={i} style={styles.lineNum}>{i + 1}</div>
              ))}
            </div>
            <textarea
              style={styles.textarea}
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder={`Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]`}
              spellCheck={false}
            />
          </div>
          {/* ACTION BAR — always visible */}
          <div style={styles.actionBar}>
            <button style={{...styles.runBtn, opacity: loading ? 0.7 : 1}} onClick={getHints} disabled={loading}>
              {loading ? '⟳ thinking...' : '▶ Get Hints'}
            </button>
            <button style={styles.clearBtn} onClick={clearAll}>Clear</button>
            <span style={styles.depthBadge}>
              depth: {depth===1?'nudge':depth===2?'approach':'detailed'}
            </span>
          </div>
        </div>

        {/* BOTTOM: output panel */}
        <div style={styles.bottomPanel}>
          <div style={styles.panelTabs}>
            {PANELS.map(p => (
              <button key={p} onClick={() => setActivePanel(p)}
                style={{...styles.panelTab, ...(activePanel===p ? styles.panelTabActive : {})}}>
                {p}
              </button>
            ))}
          </div>
          <div style={styles.panelContent}>
            {activePanel === 'CODE' ? (
              <textarea
                style={styles.codeEditor}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="// write your solution here"
                spellCheck={false}
              />
            ) : (
              <HintPanel
                content={results[activePanel]}
                loading={loading}
                error={errors[activePanel]}
              />
            )}
          </div>
        </div>

        {/* STATUS BAR */}
        <div style={styles.statusBar}>
          <div style={styles.statusLeft}>
            <span style={styles.statusItem}>{difficulty.toUpperCase()}</span>
            <span style={styles.statusItem}>{language.toUpperCase()}</span>
            <span style={styles.statusItem}>{selTopics.length ? selTopics.join(', ').toUpperCase() : 'NO TAGS'}</span>
          </div>
          <span style={styles.statusItem}>DSA HINT ENGINE v2.0</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 44px)',
    overflow: 'hidden',
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  topSection: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid var(--border)',
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: 'var(--surface2)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  fileTag: { fontSize: '11px', color: 'var(--muted)' },
  charCount: { fontSize: '10px', color: 'var(--dim)' },
  textWrap: {
    display: 'flex',
    height: '200px',
    overflow: 'hidden',
  },
  lineNums: {
    width: '38px',
    background: 'var(--surface)',
    padding: '12px 8px',
    fontSize: '12px',
    lineHeight: '22px',
    color: 'var(--dim)',
    textAlign: 'right',
    flexShrink: 0,
    overflowY: 'hidden',
    borderRight: '1px solid var(--border)',
    userSelect: 'none',
  },
  lineNum: { height: '22px', lineHeight: '22px' },
  textarea: {
    flex: 1,
    background: 'var(--surface2)',
    border: 'none',
    color: 'var(--text)',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '13px',
    lineHeight: '22px',
    padding: '12px 16px',
    resize: 'none',
    outline: 'none',
    tabSize: 2,
    overflowY: 'auto',
  },
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  runBtn: {
    padding: '9px 22px',
    background: 'var(--green)',
    color: '#0a1a0f',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '13px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '9px 14px',
    background: 'none',
    border: '1px solid var(--border2)',
    color: 'var(--muted)',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  depthBadge: { marginLeft: 'auto', fontSize: '11px', color: 'var(--dim)' },
  bottomPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'var(--surface)',
  },
  panelTabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  panelTab: {
    padding: '8px 18px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono',monospace",
    color: 'var(--muted)',
    cursor: 'pointer',
    border: 'none',
    borderRight: '1px solid var(--border)',
    borderBottom: '2px solid transparent',
    background: 'none',
    transition: 'all 0.15s',
  },
  panelTabActive: {
    color: 'var(--green)',
    borderBottom: '2px solid var(--green)',
    background: 'var(--surface2)',
  },
  panelContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
  },
  codeEditor: {
    width: '100%',
    height: '100%',
    background: 'var(--surface2)',
    border: 'none',
    color: 'var(--text)',
    fontFamily: "'JetBrains Mono',monospace",
    fontSize: '13px',
    lineHeight: '22px',
    resize: 'none',
    outline: 'none',
    minHeight: '150px',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 16px',
    background: 'var(--green)',
    flexShrink: 0,
  },
  statusLeft: { display: 'flex', gap: '16px' },
  statusItem: { fontSize: '10px', color: '#0a2a15', fontWeight: '700', letterSpacing: '0.05em' },
};
