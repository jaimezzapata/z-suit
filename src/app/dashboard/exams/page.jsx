'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getExamsByCourse, deleteExam, getCoursesByProfesor, getExamsByProfesor } from '@/lib/firebase/firestore';
import { Plus, Trash2, Eye, Copy, Clock, Users, FileQuestion } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { DashboardNav } from '@/components/DashboardNav';
import ExamForm from '@/components/exams/ExamForm';

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar cursos del profesor
      const coursesResult = await getCoursesByProfesor(user.uid);
      if (coursesResult.success) {
        setCourses(coursesResult.data);
        
        // Cargar todos los exámenes del profesor
        const examsResult = await getExamsByProfesor(user.uid);
        if (examsResult.success) {
          // Enriquecer exámenes con información del curso
          const enrichedExams = examsResult.data.map(exam => {
            const course = coursesResult.data.find(c => c.id === exam.courseId);
            return {
              ...exam,
              courseName: course?.name || 'Curso no encontrado',
              courseNivel: course?.nivel || '-'
            };
          });
          setExams(enrichedExams);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (!confirm('¿Estás seguro de eliminar este examen?')) return;
    
    const result = await deleteExam(examId);
    if (result.success) {
      setExams(exams.filter(e => e.id !== examId));
    }
  };

  const copyAccessCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado al portapapeles');
  };

  const filteredExams = selectedCourse === 'all' 
    ? exams 
    : exams.filter(e => e.courseId === selectedCourse);

  if (loading) {
    return (
      <>
        <DashboardNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando exámenes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Exámenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crea y administra exámenes con IA para tus cursos
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Examen
        </Button>
      </div>

      {/* Filtro por curso */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtrar por curso
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los cursos</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} - Nivel {course.nivel}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de exámenes */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay exámenes aún
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crea tu primer examen con preguntas generadas por IA
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Examen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map(exam => (
            <div
              key={exam.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {exam.title}
                  </h3>
                  <a 
                    href={`/dashboard/courses/${exam.courseId}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {exam.courseName} • Nivel {exam.courseNivel}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  exam.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {exam.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* Código de acceso */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Código de acceso
                    </p>
                    <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {exam.accessCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyAccessCode(exam.accessCode)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    title="Copiar código"
                  >
                    <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FileQuestion className="w-4 h-4 text-gray-400 mr-1" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {exam.questions?.length || 0}/{exam.questionCount || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Preguntas
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {exam.timeLimit || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minutos
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-gray-400 mr-1" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {exam.attempts || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Intentos
                  </p>
                </div>
              </div>

              {/* Estado de preguntas */}
              {exam.questions?.length === 0 && exam.generateWithAI && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    ⚠️ Preguntas pendientes de generación
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.location.href = `/dashboard/exams/${exam.id}/questions`}
                  >
                    <FileQuestion className="w-4 h-4 mr-1" />
                    {exam.questions?.length > 0 ? 'Ver Preguntas' : 'Generar Preguntas'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/dashboard/exams/${exam.id}/results`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Resultados
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(exam.id)}
                  className="w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar Examen
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de crear examen */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Examen"
        size="2xl"
        fullHeight
      >
        <ExamForm
          courses={courses}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      </div>
    </>
  );
}
