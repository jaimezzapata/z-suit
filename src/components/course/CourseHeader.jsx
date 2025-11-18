'use client';

import { BookOpen, Search, Moon, Sun, Menu } from 'lucide-react';
import { useState } from 'react';

export function CourseHeader({ course, currentSession, totalSessions, onSearch, onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="bg-[var(--bg-dark)] border-b border-[var(--border-color)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Course Info */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-medium)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                title="Menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <BookOpen className="w-8 h-8 text-[var(--accent-primary)]" />
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {course.name}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Sesión {currentSession + 1} de {totalSessions} • Nivel {course.nivel}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-medium)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              title="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-[var(--bg-medium)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              title="Cambiar tema"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar (expandible) */}
        {searchOpen && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar en todas las sesiones..."
              className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
