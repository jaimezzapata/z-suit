'use client';

import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function SessionNavigation({ 
  currentSession, 
  totalSessions, 
  onPrevious, 
  onNext,
  courseName 
}) {
  const progress = ((currentSession + 1) / totalSessions) * 100;

  return (
    <div className="bg-[var(--bg-dark)] border-t border-[var(--border-color)] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
          <Home className="w-4 h-4" />
          <span>/</span>
          <span className="truncate max-w-xs">{courseName}</span>
          <span>/</span>
          <span className="text-[var(--accent-primary)]">Sesión {currentSession + 1}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-2">
            <span>Progreso del curso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-[var(--bg-medium)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentSession === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sesión Anterior</span>
            <span className="sm:hidden">Anterior</span>
          </Button>

          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Sesión {currentSession + 1} de {totalSessions}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={currentSession === totalSessions - 1}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Siguiente Sesión</span>
            <span className="sm:hidden">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
