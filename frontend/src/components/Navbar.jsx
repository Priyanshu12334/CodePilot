import React from 'react';
import { Columns2 } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';

// Navbar receives theme and toggleTheme from parent (App)
const Navbar = ({ theme = 'dark', toggleTheme = () => {} }) => {
  const isDark = theme === 'dark';

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: isDark ? '#0f1720' : '#ffffff',
        borderBottom: isDark ? '1px solid #1e2d3d' : '1px solid #e2e8f0',
      }}
    >
      {/* Logo */}
      <div className="navbar-logo">
        <Columns2 size={26} color="#1d4ed8" />
        <span
          className="navbar-brand"
          style={{ color: isDark ? '#f4f4f5' : '#0b1220' }}
        >
          CodePilot
        </span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="theme-toggle"
        style={{
          backgroundColor: isDark ? '#18181b' : '#f1f5f9',
          border: isDark ? '1px solid #3f3f46' : '1px solid #e2e8f0',
        }}
      >
        {isDark
          ? <Sun  size={18} color="#fbbf24" />
          : <Moon size={18} color="#334155" />
        }
      </button>
    </nav>
  );
};

export default Navbar;