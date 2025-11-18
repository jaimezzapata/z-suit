'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { getDocumentById, updateExam } from '@/lib/firebase/firestore';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui';
import { ArrowLeft, Sparkles, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function QuestionsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && params.examId) {
      loadExam();
    }
  }, [user, params.examId]);

  const loadExam = async () => {
    setLoading(true);
    try {
      const examResult = await getDocumentById('exams', params.examId);
      if (examResult.success) {
        setExam(examResult.data);
        
        const courseResult = await getDocumentById('courses', examResult.data.courseId);
        if (courseResult.success) {
          setCourse(courseResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading exam:', error);
      setError('Error al cargar el examen');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!exam || !course) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: params.examId,
          courseId: exam.courseId,
          questionCount: exam.questionCount
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadExam();
        alert('✅ Preguntas generadas exitosamente');
      } else {
        if (response.status === 429) {
          setError(`⏱️ ${result.error}\n\nEspera ${result.retryAfter || 60} segundos antes de intentar nuevamente.`);
        } else {
          setError(result.error || 'Error al generar preguntas');
        }
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Error al generar preguntas');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('¿Eliminar esta pregunta?')) return;
    
    const updatedQuestions = exam.questions.filter(q => q.id !== questionId);
    const result = await updateExam(params.examId, { questions: updatedQuestions });
    
    if (result.success) {
      setExam({ ...exam, questions: updatedQuestions });
    }
  };

  const handleActivateExam = async () => {
    if (!confirm('¿Activar este examen? Los estudiantes podrán acceder con el código.')) return;
    
    const result = await updateExam(params.examId, { status: 'active' });
    if (result.success) {
      setExam({ ...exam, status: 'active' });
      alert('✅ Examen activado');
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  if (!exam || !course) {
    return (
      <>
        <DashboardNav />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Examen no encontrado
            </h2>
            <Button onClick={() => router.push('/dashboard/exams')}>
              Volver a Exámenes
            </Button>
          </div>
        </div>
      </>
    );
  }

  const hasQuestions = exam.questions && exam.questions.length > 0;
  const isComplete = exam.questions?.length === exam.questionCount;

  return (
    <>
      <DashboardNav />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/exams')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Exámenes
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {exam.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {course.name} - Nivel {course.nivel}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                  Código: <span className="font-mono font-bold">{exam.accessCode}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  exam.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : exam.status === 'draft'
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}>
                  {exam.status === 'active' ? 'Activo' : exam.status === 'draft' ? 'Borrador' : 'Cerrado'}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {exam.questions?.length || 0}/{exam.questionCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Preguntas</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p className="whitespace-pre-line">{error}</p>
            </div>
          </div>
        )}

        {!hasQuestions && exam.generateWithAI && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Generación Automática de Preguntas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Este examen está configurado para generar {exam.questionCount} preguntas 
                  automáticamente basadas en la documentación del curso.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  📚 {course.sessions.filter(s => s.documentation).length} sesiones con documentación disponible
                </p>
              </div>
              <Button
                onClick={handleGenerateQuestions}
                disabled={generating}
                className="ml-4"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Preguntas
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {isComplete && exam.status === 'draft' && (
          <div className="mb-6">
            <Button onClick={handleActivateExam} className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Activar Examen
            </Button>
          </div>
        )}

        {hasQuestions ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Preguntas del Examen
            </h2>
            {exam.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium">
                        Pregunta {index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.difficulty === 'easy' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : question.difficulty === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Media' : 'Difícil'}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {question.question}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg border ${
                        optIndex === question.correctAnswer
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className={optIndex === question.correctAnswer 
                          ? 'text-green-800 dark:text-green-200 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                        }>
                          {option}
                        </span>
                        {optIndex === question.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                      💡 Explicación:
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay preguntas aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {exam.generateWithAI 
                ? 'Usa el botón de arriba para generar preguntas automáticamente'
                : 'Agrega preguntas manualmente o habilita la generación con IA'
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}
