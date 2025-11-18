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
        fixed lg:sticky lg:top-20 left-0 h-screen lg:h-[calc(100vh-5rem)] 
        w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        z-50 lg:z-10 overflow-y-auto
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between lg:hidden">
          <h3 className="font-semibold text-gray-900 dark:text-white">Contenido</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Sesiones */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Sesiones
          </h3>
          <div className="grid grid-cols-6 gap-1.5">
            {sessions.map((session, index) => (
              <button
                key={index}
                onClick={() => {
                  onSessionChange(index);
                  onClose();
                }}
                className={`
                  aspect-square rounded-md text-xs font-bold flex items-center justify-center
                  transition-all duration-200 relative
                  ${currentSession === index
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md'
                    : session.documentation
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 opacity-60'
                  }
                `}
                title={session.title || `Sesión ${index + 1}`}
              >
                {index + 1}
                {session.documentation && currentSession !== index && (
                  <CheckCircle2 className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-green-500 bg-white dark:bg-gray-900 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Contents */}
        {tableOfContents && tableOfContents.length > 0 && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              En esta sesión
            </h3>
            <nav className="space-y-0.5">
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
                    block py-1.5 px-3 rounded text-xs transition-colors
                    hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400
                    ${item.level === 1 ? 'font-semibold text-gray-900 dark:text-white' : ''}
                    ${item.level === 2 ? 'pl-5 text-gray-600 dark:text-gray-400' : ''}
                    ${item.level === 3 ? 'pl-8 text-gray-500 dark:text-gray-500 text-[0.7rem]' : ''}
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
