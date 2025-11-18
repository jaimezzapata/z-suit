'use client';

import { CheckCircle2, Circle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function SessionSidebar({ 
  sessions, 
  currentSession, 
  onSessionChange, 
  isOpen, 
  onClose,
  tableOfContents 
}) {
  return (
    <>
      {/* Backdrop para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-80px)] 
        w-80 bg-[var(--bg-dark)] border-r border-[var(--border-color)]
        z-50 lg:z-10 overflow-y-auto
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-[var(--text-primary)]">Contenido</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-medium)] text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Sesiones */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
            Sesiones
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {sessions.map((session, index) => (
              <button
                key={index}
                onClick={() => {
                  onSessionChange(index);
                  onClose();
                }}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                  transition-all duration-200
                  ${currentSession === index
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white'
                    : session.documentation
                    ? 'border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-primary)]'
                    : 'border-[var(--border-color)] opacity-40 text-[var(--text-secondary)]'
                  }
                `}
                title={session.title || `Sesión ${index + 1}`}
              >
                <span className="text-sm font-bold">S{index + 1}</span>
                {session.documentation && currentSession !== index && (
                  <CheckCircle2 className="w-3 h-3 mt-1 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Contents */}
        {tableOfContents && tableOfContents.length > 0 && (
          <div className="p-4 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
              En esta sesión
            </h3>
            <nav className="space-y-1">
              {tableOfContents.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                    onClose();
                  }}
                  className={`
                    block py-2 px-3 rounded text-sm transition-colors
                    hover:bg-[var(--bg-medium)] hover:text-[var(--accent-primary)]
                    ${item.level === 1 ? 'font-semibold text-[var(--text-primary)]' : ''}
                    ${item.level === 2 ? 'pl-6 text-[var(--text-secondary)]' : ''}
                    ${item.level === 3 ? 'pl-9 text-[var(--text-secondary)] text-xs' : ''}
                  `}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
