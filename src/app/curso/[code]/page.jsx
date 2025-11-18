'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getCourseByAccessCode } from '@/lib/firebase/firestore';
import { Menu, Lock, BookOpen } from 'lucide-react';
import { 
  CourseHeader, 
  SessionSidebar, 
  SessionContent, 
  SessionNavigation 
} from '@/components/course';

export default function PrivateCoursePage() {
  const params = useParams();
  const code = params.code;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [code]);

  const loadCourse = async () => {
    try {
      const result = await getCourseByAccessCode(code.toUpperCase());
      if (result.success && result.data) {
        setCourse(result.data);
        // Restaurar sesión desde localStorage
        const savedSession = localStorage.getItem(`course-${code}-session`);
        if (savedSession) {
          setCurrentSession(parseInt(savedSession));
        }
      } else {
        setCourse(null);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  // Guardar sesión actual en localStorage
  useEffect(() => {
    if (course) {
      localStorage.setItem(`course-${code}-session`, currentSession.toString());
    }
  }, [currentSession, code, course]);

  // Extraer Table of Contents del markdown
  const tableOfContents = useMemo(() => {
    const session = course?.sessions?.[currentSession];
    if (!session?.documentation) return [];

    const headings = [];
    const lines = session.documentation.split('\n');
    
    lines.forEach(line => {
      const h1Match = line.match(/^#\s+(.+)$/);
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      
      if (h1Match) {
        const text = h1Match[1];
        headings.push({
          level: 1,
          text,
          id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      } else if (h2Match) {
        const text = h2Match[1];
        headings.push({
          level: 2,
          text,
          id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      } else if (h3Match) {
        const text = h3Match[1];
        headings.push({
          level: 3,
          text,
          id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      }
    });

    return headings;
  }, [course, currentSession]);

  const session = course?.sessions?.[currentSession];
  const hasDocumentation = session?.documentation;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-darkest)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[var(--bg-darkest)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Código inválido
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            No existe ningún curso con este código de acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)]">
      {/* Header */}
      <CourseHeader
        course={course}
        currentSession={currentSession}
        totalSessions={course.sessions.length}
        onSearch={(query) => console.log('Buscar:', query)}
      />

      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 left-6 z-30 lg:hidden p-4 bg-[var(--accent-primary)] text-white rounded-full shadow-lg hover:bg-[var(--accent-hover)] transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex">
        {/* Sidebar */}
        <SessionSidebar
          sessions={course.sessions}
          currentSession={currentSession}
          onSessionChange={setCurrentSession}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          tableOfContents={tableOfContents}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {hasDocumentation ? (
              <div className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg p-8 shadow-lg">
                <SessionContent content={session.documentation} />
              </div>
            ) : (
              <div className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Contenido no disponible
                </h2>
                <p className="text-[var(--text-secondary)]">
                  La documentación para esta sesión aún no ha sido generada.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <SessionNavigation
            currentSession={currentSession}
            totalSessions={course.sessions.length}
            onPrevious={() => setCurrentSession(Math.max(0, currentSession - 1))}
            onNext={() => setCurrentSession(Math.min(course.sessions.length - 1, currentSession + 1))}
            courseName={course.name}
          />
        </main>
      </div>
    </div>
  );
}
