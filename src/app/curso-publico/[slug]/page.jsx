'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCourseBySlug } from '@/lib/firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ChevronLeft, ChevronRight, Menu, X, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    {course.name}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nivel {course.nivel}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navegación sesiones - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSession(Math.max(0, currentSession - 1))}
                disabled={currentSession === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentSession + 1} / {course.sessions.length}
              </span>
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
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                Contenido del curso
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.description}
              </p>
            </div>
            
            <nav className="space-y-1">
              {course.sessions.map((sess, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSession(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all group ${
                    currentSession === index
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : sess.documentation
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!sess.documentation}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      currentSession === index ? 'text-white' : ''
                    }`}>
                      {sess.documentation ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${
                          currentSession === index
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Sesión {index + 1}
                        </span>
                      </div>
                      <p className={`text-sm font-medium truncate ${
                        currentSession === index
                          ? 'text-white'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {sess.title || 'Sin título'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Sidebar móvil */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sesiones
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="space-y-1">
                  {course.sessions.map((sess, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSession(index);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        currentSession === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : sess.documentation
                          ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!sess.documentation}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {sess.documentation ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                            Sesión {index + 1}
                          </span>
                          <p className="text-sm font-medium">
                            {sess.title || 'Sin título'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            {hasDocumentation ? (
              <article className="max-w-4xl">
                {/* Título de la sesión */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                    <BookOpen className="w-4 h-4" />
                    Sesión {currentSession + 1}
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {session.title}
                  </h1>
                </div>

                {/* Separador decorativo */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-12"></div>

                {/* Contenido Markdown */}
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

                {/* Navegación inferior */}
                <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    {currentSession > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentSession(currentSession - 1)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div className="text-xs text-gray-500">Anterior</div>
                          <div className="font-medium">{course.sessions[currentSession - 1]?.title || `Sesión ${currentSession}`}</div>
                        </div>
                      </Button>
                    )}
                  </div>
                  <div>
                    {currentSession < course.sessions.length - 1 && (
                      <Button
                        onClick={() => setCurrentSession(currentSession + 1)}
                      >
                        <div className="text-right">
                          <div className="text-xs text-white/80">Siguiente</div>
                          <div className="font-medium">{course.sessions[currentSession + 1]?.title || `Sesión ${currentSession + 2}`}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ) : (
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Contenido no disponible
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  La documentación para esta sesión aún no ha sido generada por el profesor.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Botones navegación móvil - fijos abajo */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentSession(Math.max(0, currentSession - 1))}
          disabled={currentSession === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentSession(Math.min(course.sessions.length - 1, currentSession + 1))}
          disabled={currentSession === course.sessions.length - 1}
          className="flex-1"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
