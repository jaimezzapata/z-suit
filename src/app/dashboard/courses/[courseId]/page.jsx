'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BookOpen, Sparkles, Save, ArrowLeft, Eye, Code, Upload, FileText, FolderOpen, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CourseSessionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({ title: '', keyTopics: '' });
  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'edit'
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadCourse();
  }, [user, courseId]);

  const loadCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        setCourse({ id: courseDoc.id, ...courseDoc.data() });
      } else {
        toast.error('Curso no encontrado');
        router.push('/dashboard/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (index) => {
    const session = course.sessions[index];
    setEditingSession(index);
    setSessionForm({
      title: session.title || '',
      keyTopics: session.keyTopics || ''
    });
    setGeneratedDoc(session.documentation || '');
  };

  const handleSaveSession = async () => {
    try {
      const updatedSessions = [...course.sessions];
      updatedSessions[editingSession] = {
        ...updatedSessions[editingSession],
        title: sessionForm.title,
        keyTopics: sessionForm.keyTopics,
        documentation: generatedDoc
      };

      await updateDoc(doc(db, 'courses', courseId), {
        sessions: updatedSessions
      });

      setCourse({ ...course, sessions: updatedSessions });
      toast.success('Sesión guardada');
      setEditingSession(null);
      setSessionForm({ title: '', keyTopics: '' });
      setGeneratedDoc('');
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Error al guardar la sesión');
    }
  };

  const handleGenerateDoc = async () => {
    if (!sessionForm.title || !sessionForm.keyTopics) {
      toast.error('Completa el título y los temas clave');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: course.name,
          sessionNumber: editingSession + 1,
          sessionTitle: sessionForm.title,
          keyTopics: sessionForm.keyTopics
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedDoc(data.documentation);
        toast.success('Documentación generada');
      } else {
        toast.error(data.error || 'Error al generar documentación');
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast.error('Error al generar documentación');
    } finally {
      setGenerating(false);
    }
  };

  const handleImportMarkdown = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      toast.error('Solo se permiten archivos .md');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setGeneratedDoc(content);
        toast.success('Archivo Markdown importado');
      }
    };
    reader.onerror = () => {
      toast.error('Error al leer el archivo');
    };
    reader.readAsText(file);
    
    // Reset input para permitir importar el mismo archivo nuevamente
    event.target.value = '';
  };

  const handleExportMarkdown = () => {
    if (!generatedDoc) {
      toast.error('No hay contenido para exportar');
      return;
    }

    const blob = new Blob([generatedDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionForm.title || `sesion-${editingSession + 1}`}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Archivo descargado');
  };

  const handleSaveToProject = async () => {
    if (!generatedDoc || !sessionForm.title) {
      toast.error('Completa el título y genera/importa documentación primero');
      return;
    }

    try {
      const response = await fetch('/api/save-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courseId,
          courseName: course.name,
          courseCode: course.code,
          sessionNumber: editingSession + 1,
          sessionTitle: sessionForm.title,
          content: generatedDoc
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Guardado en: ${data.path}`);
      } else {
        toast.error(data.error || 'Error al guardar en proyecto');
      }
    } catch (error) {
      console.error('Error saving to project:', error);
      toast.error('Error al guardar en proyecto');
    }
  };

  const handleLoadFromProject = async () => {
    try {
      const response = await fetch(
        `/api/save-markdown?courseId=${courseId}&courseCode=${course.code}&courseName=${encodeURIComponent(course.name)}&sessionNumber=${editingSession + 1}`
      );

      const data = await response.json();
      if (data.success) {
        setGeneratedDoc(data.content);
        toast.success(`Cargado desde: ${data.path}`);
      } else {
        toast.error(data.error || 'No se encontró archivo en el proyecto');
      }
    } catch (error) {
      console.error('Error loading from project:', error);
      toast.error('Error al cargar desde proyecto');
    }
  };

  const handleSyncFromDocs = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          courseId,
          courseName: course.name,
          courseCode: course.code
        })
      });

      const data = await response.json();
      if (data.success && data.sessions.length > 0) {
        // Update sessions in Firebase
        const updatedSessions = [...course.sessions];
        let updatedCount = 0;

        data.sessions.forEach(({ sessionNumber, title, documentation }) => {
          const index = sessionNumber - 1;
          if (index >= 0 && index < 18) {
            updatedSessions[index] = {
              ...updatedSessions[index],
              title: title || updatedSessions[index].title,
              documentation: documentation || updatedSessions[index].documentation
            };
            updatedCount++;
          }
        });

        // Save to Firebase
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, { sessions: updatedSessions });

        // Update local state
        setCourse({ ...course, sessions: updatedSessions });
        toast.success(`Sincronizadas ${updatedCount} sesiones desde /docs`);
      } else {
        toast.info(data.message || 'No se encontraron archivos en /docs');
      }
    } catch (error) {
      console.error('Error syncing from docs:', error);
      toast.error('Error al sincronizar desde /docs');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/courses')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Cursos
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {course.description} • Nivel {course.nivel}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={handleSyncFromDocs}
              disabled={syncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar desde /docs'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {course.sessions.map((session, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Sesión {index + 1}
                  </h3>
                </div>
                {session.documentation && (
                  <div className="w-2 h-2 rounded-full bg-green-500" title="Documentación generada" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {session.title || 'Sin título'}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditSession(index)}
                className="w-full"
              >
                {session.title ? 'Editar' : 'Configurar'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      {editingSession !== null && (
        <Modal
          isOpen={true}
          onClose={() => {
            setEditingSession(null);
            setSessionForm({ title: '', keyTopics: '' });
            setGeneratedDoc('');
          }}
          title={`Sesión ${editingSession + 1}`}
          size="2xl"
        >
          <div className="h-full grid grid-cols-2 gap-6">
            {/* Columna Izquierda - Formulario (Fixed, sin scroll) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Título de la sesión
                </label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                  placeholder="ej: Introducción a React Hooks"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex-shrink-0">
                  Temas clave
                </label>
                <textarea
                  value={sessionForm.keyTopics}
                  onChange={(e) => setSessionForm({ ...sessionForm, keyTopics: e.target.value })}
                  className="flex-1 w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 resize-none overflow-y-auto"
                  placeholder="useState, useEffect, custom hooks, reglas..."
                />
              </div>

              <div className="space-y-2 flex-shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleGenerateDoc}
                    disabled={generating || !sessionForm.title || !sessionForm.keyTopics}
                    className="w-full"
                  >
                    {generating ? (
                      <>Generando...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar IA
                      </>
                    )}
                  </Button>

                  <label className="w-full">
                    <input
                      type="file"
                      accept=".md"
                      onChange={handleImportMarkdown}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.currentTarget.previousElementSibling?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importar
                    </Button>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleLoadFromProject}
                    className="w-full"
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Cargar
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleSaveToProject}
                    disabled={!generatedDoc || !sessionForm.title}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>

                <Button
                  onClick={handleSaveSession}
                  disabled={!sessionForm.title}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Sesión
                </Button>
              </div>
            </div>            {/* Columna Derecha - Preview/Editor (Solo esta columna tiene scroll) */}
            <div className="flex flex-col h-full overflow-hidden">
                {generatedDoc ? (
                  <>
                    <div className="flex items-center justify-between mb-3 flex-shrink-0">
                      <label className="block text-sm font-medium text-[var(--text-primary)]">
                        Documentación
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportMarkdown}
                          className="px-2 py-1 text-xs rounded-lg flex items-center gap-1 bg-[var(--bg-medium)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-darkest)]"
                          title="Descargar .md"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setViewMode('preview')}
                          className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 ${
                            viewMode === 'preview'
                              ? 'bg-[var(--accent-primary)] text-white'
                              : 'bg-[var(--bg-medium)] border border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setViewMode('edit')}
                          className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 ${
                            viewMode === 'edit'
                              ? 'bg-[var(--accent-primary)] text-white'
                              : 'bg-[var(--bg-medium)] border border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          <Code className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  <div className="flex-1 min-h-0">
                    {viewMode === 'preview' ? (
                      <div className="h-full overflow-y-auto">
                        <div className="p-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg-darkest)] prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {generatedDoc}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <textarea
                        value={generatedDoc}
                        onChange={(e) => setGeneratedDoc(e.target.value)}
                        className="h-full w-full px-4 py-2.5 border border-[var(--border-color)] rounded-lg bg-[var(--bg-medium)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 font-mono text-xs resize-none"
                      />
                    )}
                  </div>
                  </>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--border-color)] rounded-lg bg-[var(--bg-darkest)]">
                  <div className="text-center text-[var(--text-secondary)]">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Genera o importa documentación</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
