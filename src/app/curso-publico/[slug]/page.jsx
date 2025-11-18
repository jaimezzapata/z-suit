'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getCourseBySlug } from '@/lib/firebase/firestore';
import { X } from 'lucide-react';
import { 
  CourseHeader, 
  SessionSidebar, 
  SessionContent, 
  SessionNavigation 
} from '@/components/course';

export default function PublicCoursePage() {
  const params = useParams();
  const slug = params.slug;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    try {
      const result = await getCourseBySlug(slug);
      if (result.success && result.data && result.data.isPublic) {
        setCourse(result.data);
        // Restaurar sesión desde localStorage
        const savedSession = localStorage.getItem(`course-${slug}-session`);
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
      localStorage.setItem(`course-${slug}-session`, currentSession.toString());
    }
  }, [currentSession, slug, course]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Curso no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Este curso no existe o no está disponible públicamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <CourseHeader
        course={course}
        currentSession={currentSession}
        totalSessions={course.sessions.length}
        onSearch={(query) => console.log('Search:', query)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex max-w-7xl mx-auto">
        <SessionSidebar
          sessions={course.sessions}
          currentSession={currentSession}
          onSessionChange={setCurrentSession}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          tableOfContents={tableOfContents}
        />

        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            <SessionContent
              session={session}
              currentSession={currentSession}
            />

            <SessionNavigation
              currentSession={currentSession}
              totalSessions={course.sessions.length}
              onPrevious={() => setCurrentSession(Math.max(0, currentSession - 1))}
              onNext={() => setCurrentSession(Math.min(course.sessions.length - 1, currentSession + 1))}
              courseName={course.name}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
