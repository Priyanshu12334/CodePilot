import React, { useState, useEffect } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import axios from 'axios'; // ← calls our Express backend instead of Gemini directly
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";
import { Copy, Check } from 'lucide-react';

const PreBlock = ({ children, node, ...props }) => {
  const [copied, setCopied] = useState(false);

  const getText = (n) => {
    if (!n) return '';
    if (n.type === 'code') return n.value || '';
    if (n.type === 'text') return n.value || '';
    if (n.children) return n.children.map(getText).join('');
    return '';
  };

  const handleCopy = () => {
    const text = getText(node);
    navigator.clipboard.writeText(text.replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pre-wrapper group">
      <button
        onClick={handleCopy}
        className="copy-btn"
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre {...props}>
        {children}
      </pre>
    </div>
  );
};

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python',     label: 'Python'     },
    { value: 'java',       label: 'Java'       },
    { value: 'csharp',     label: 'C#'         },
    { value: 'c',          label: 'C'          },
    { value: 'cpp',        label: 'C++'        },
    { value: 'php',        label: 'PHP'        },
    { value: 'sql',        label: 'SQL'        },
    { value: 'ruby',       label: 'Ruby'       },
    { value: 'go',         label: 'Go'         },
    { value: 'swift',      label: 'Swift'      },
    { value: 'kotlin',     label: 'Kotlin'     },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust',       label: 'Rust'       },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code,           setCode]           = useState('');
  const [theme,          setTheme]          = useState('dark');
  const [loading,        setLoading]        = useState(false);
  const [response,       setResponse]       = useState('');

  // ── Theme toggle ─────────────────────────────────────────
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light', theme === 'light');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // ── Backend base URL ──────────────────────────────────────
  // Dev: http://localhost:5000 | Prod: set VITE_API_URL to Render URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ── Review code ───────────────────────────────────────────
  async function reviewCode() {
    setResponse('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/review`, {
        code,
        language: selectedOption.value,
      });
      setResponse(res.data.review);
    } catch (err) {
      const msg = err?.response?.data?.error || '❌ Something went wrong. Please try again.';
      setResponse(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Fix code ──────────────────────────────────────────────
  async function fixCode() {
    setResponse('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/fix`, {
        code,
        language: selectedOption.value,
      });
      setResponse(res.data.review);
    } catch (err) {
      const msg = err?.response?.data?.error || '❌ Something went wrong. Please try again.';
      setResponse(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── react-select styles (dark / light) ───────────────────
  const selectStylesDark = {
    container: (p) => ({ ...p, flex: '1 1 140px', minWidth: '130px' }),
    control: (p) => ({
      ...p,
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      borderRadius: '8px',
      boxShadow: 'none',
      minHeight: '38px',
      '&:hover': { borderColor: '#52525b' },
    }),
    menu: (p) => ({
      ...p,
      backgroundColor: '#18181b',
      border: '1px solid #3f3f46',
      borderRadius: '8px',
      zIndex: 9999,
    }),
    menuList: (p) => ({ ...p, padding: '4px' }),
    singleValue: (p) => ({ ...p, color: '#f4f4f5' }),
    option: (p, s) => ({
      ...p,
      backgroundColor: s.isFocused ? '#27272a' : 'transparent',
      color: '#e4e4e7',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
    input:       (p) => ({ ...p, color: '#f4f4f5' }),
    placeholder: (p) => ({ ...p, color: '#71717a' }),
    dropdownIndicator: (p) => ({ ...p, color: '#71717a' }),
    indicatorSeparator: (p) => ({ ...p, backgroundColor: '#3f3f46' }),
  };

  const selectStylesLight = {
    container: (p) => ({ ...p, flex: '1 1 140px', minWidth: '130px' }),
    control: (p) => ({
      ...p,
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderRadius: '8px',
      boxShadow: 'none',
      minHeight: '38px',
      '&:hover': { borderColor: '#94a3b8' },
    }),
    menu: (p) => ({
      ...p,
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      zIndex: 9999,
    }),
    menuList: (p) => ({ ...p, padding: '4px' }),
    singleValue: (p) => ({ ...p, color: '#0f172a' }),
    option: (p, s) => ({
      ...p,
      backgroundColor: s.isFocused ? '#f1f5f9' : 'transparent',
      color: '#0f172a',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
    input:       (p) => ({ ...p, color: '#0f172a' }),
    placeholder: (p) => ({ ...p, color: '#94a3b8' }),
    dropdownIndicator: (p) => ({ ...p, color: '#94a3b8' }),
    indicatorSeparator: (p) => ({ ...p, backgroundColor: '#e2e8f0' }),
  };

  const isDark = theme === 'dark';

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* ── Main layout: column on mobile, row on desktop ── */}
      <div className="main">

        {/* ── LEFT: Editor panel ──────────────────────────── */}
        <div className="left">

          {/* Toolbar: language selector + action buttons */}
          <div className="tabs">
            <Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e)}
              options={options}
              styles={isDark ? selectStylesDark : selectStylesLight}
              isSearchable
              aria-label="Select programming language"
            />

            <button
              id="btn-fix-code"
              onClick={() => {
                if (code === '') { alert('Please enter code first'); return; }
                fixCode();
              }}
              disabled={loading}
              className={`btnNormal ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'btn-fix-dark' : 'btnReview'}`}
              aria-label="Fix code with AI"
            >
              Fix Code
            </button>

            <button
              id="btn-review-code"
              onClick={() => {
                if (code === '') { alert('Please enter code first'); return; }
                reviewCode();
              }}
              disabled={loading}
              className={`btnNormal ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'btn-review-dark' : 'btnReview'}`}
              aria-label="Review code with AI"
            >
              Review
            </button>
          </div>

          {/* Monaco Editor fills remaining height of left panel */}
          <div className="editor-wrapper">
            <Editor
              height="100%"
              theme={isDark ? 'vs-dark' : 'light'}
              language={selectedOption.value}
              value={code}
              onChange={(val) => { if (!loading) setCode(val); }}
              options={{
                automaticLayout: true,
                readOnly: loading,
                fontSize: 14,
                minimap: { enabled: false },  // saves space on mobile
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: 'off',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* ── RIGHT: Response panel ───────────────────────── */}
        <div
          className="right"
          style={{ backgroundColor: isDark ? '#09090b' : '#ffffff' }}
        >
          {/* Response header */}
          <div
            className="topTab"
            style={{ borderColor: isDark ? '#27272a' : '#e2e8f0' }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: 15,
                margin: 0,
                color: isDark ? '#f4f4f5' : '#0b1220',
              }}
            >
              Response
            </p>
          </div>

          {/* Loader */}
          {loading && (
            <div className="loader-wrap">
              <RingLoader color="#1d4ed8" size={48} />
            </div>
          )}

          {/* Markdown output */}
          <div
            className="response-body"
            style={{ color: isDark ? '#d1d5db' : '#0b1220' }}
          >
            <Markdown components={{ pre: PreBlock }}>{response}</Markdown>
          </div>
        </div>

      </div>
    </>
  );
};

export default App;