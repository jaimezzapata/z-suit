'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCourseByAccessCode } from '@/lib/firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ChevronLeft, ChevronRight, Menu, X, CheckCircle2, Circle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  const session = course?.sessions?.[currentSession];
  const hasDocumentation = session?.documentation;

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
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Código inválido
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No existe ningún curso con este código de acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {course.description} • Nivel {course.nivel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSession(Math.max(0, currentSession - 1))}
              disabled={currentSession === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Sesión {currentSession + 1} de {course.sessions.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {session?.title || 'Sin título'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentSession(Math.min(course.sessions.length - 1, currentSession + 1))}
              disabled={currentSession === course.sessions.length - 1}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasDocumentation ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:text-gray-900 dark:prose-h1:text-white prose-h1:leading-tight
              prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gradient-to-r prose-h2:from-blue-500 prose-h2:to-purple-500 prose-h2:text-gray-900 dark:prose-h2:text-white
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-gray-800 dark:prose-h3:text-gray-100
              prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-gray-800 dark:prose-h4:text-gray-200
              prose-p:text-base prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:my-6
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-800 dark:prose-em:text-gray-200
              prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/20 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:font-semibold
              prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:to-gray-800 dark:prose-pre:from-gray-950 dark:prose-pre:to-gray-900 prose-pre:border-2 prose-pre:border-gray-700 dark:prose-pre:border-gray-800 prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:my-8 prose-pre:p-6
              prose-ul:my-6 prose-ul:space-y-3
              prose-ol:my-6 prose-ol:space-y-3
              prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed
              prose-li:marker:text-blue-500 prose-li:marker:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-blue-50 prose-blockquote:to-transparent dark:prose-blockquote:from-blue-900/20 dark:prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:shadow-sm
              prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-8 prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700
              prose-hr:my-12 prose-hr:border-gray-300 dark:prose-hr:border-gray-700
              prose-table:border-2 prose-table:border-gray-200 dark:prose-table:border-gray-700 prose-table:rounded-lg prose-table:overflow-hidden prose-table:my-8 prose-table:shadow-lg
              prose-th:bg-gradient-to-r prose-th:from-gray-100 prose-th:to-gray-50 dark:prose-th:from-gray-800 dark:prose-th:to-gray-700 prose-th:text-gray-900 dark:prose-th:text-white prose-th:font-bold prose-th:py-3 prose-th:px-4
              prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:py-3 prose-td:px-4
              prose-tr:border-b prose-tr:border-gray-200 dark:prose-tr:border-gray-700
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {session.documentation}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Contenido no disponible
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              La documentación para esta sesión aún no ha sido generada.
            </p>
          </div>
        )}
      </div>

      {/* Session Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Todas las sesiones
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {course.sessions.map((sess, index) => (
            <button
              key={index}
              onClick={() => setCurrentSession(index)}
              className={`p-3 rounded-lg border text-center transition-all ${
                currentSession === index
                  ? 'bg-blue-500 text-white border-blue-500'
                  : sess.documentation
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50'
              }`}
            >
              <div className="font-semibold">S{index + 1}</div>
              {sess.documentation && (
                <div className="w-2 h-2 rounded-full bg-green-500 mx-auto mt-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
