import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <>
      <style>{`
        body.dark-mode {
          background-color: #0f172a !important;
          color: #f8fafc !important;
        }
        body.dark-mode .bg-white,
        body.dark-mode aside,
        body.dark-mode header,
        body.dark-mode main,
        body.dark-mode table,
        body.dark-mode .bg-slate-50,
        body.dark-mode .bg-gray-50,
        body.dark-mode .bg-gray-100,
        body.dark-mode div.bg-white,
        body.dark-mode select,
        body.dark-mode input,
        body.dark-mode textarea {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
          border-color: #334155 !important;
        }
        body.dark-mode input::placeholder {
          color: #64748b !important;
        }
        body.dark-mode th {
          background-color: #1e293b !important;
          color: #94a3b8 !important;
          border-bottom-color: #334155 !important;
        }
        body.dark-mode td {
          color: #cbd5e1 !important;
          border-bottom-color: #334155 !important;
        }
        body.dark-mode tr:hover {
          background-color: #33415510 !important;
        }
        body.dark-mode .text-slate-800,
        body.dark-mode .text-slate-700,
        body.dark-mode .text-slate-900,
        body.dark-mode .text-gray-800,
        body.dark-mode .text-gray-700,
        body.dark-mode .text-gray-900 {
          color: #f1f5f9 !important;
        }
        body.dark-mode .text-slate-500,
        body.dark-mode .text-slate-400,
        body.dark-mode .text-gray-500,
        body.dark-mode .text-gray-400 {
          color: #94a3b8 !important;
        }
        body.dark-mode .border,
        body.dark-mode .border-slate-100,
        body.dark-mode .border-slate-200,
        body.dark-mode .border-slate-800,
        body.dark-mode .border-b,
        body.dark-mode .border-t,
        body.dark-mode .divide-y > * {
          border-color: #334155 !important;
        }
        body.dark-mode select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
        }
        body.dark-mode a:not(.bg-blue-600):not(.bg-emerald-600),
        body.dark-mode button:not(.bg-blue-600):not(.bg-emerald-600):not(.bg-red-500):not(.bg-slate-800):not(.bg-amber-500):not(.bg-emerald-500):not(.bg-amber-600) {
          color: #cbd5e1 !important;
        }
        body.dark-mode .hover\\:bg-slate-50:hover,
        body.dark-mode .hover\\:bg-slate-100:hover,
        body.dark-mode .hover\\:bg-slate-50\\/50:hover {
          background-color: #334155 !important;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
        style={{ width: '48px', height: '48px' }}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-200" />}
      </button>
    </>
  );
}
