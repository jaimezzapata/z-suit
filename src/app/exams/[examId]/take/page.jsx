'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getDocumentById, createExamAttempt, updateExamAttempt } from '@/lib/firebase/firestore';
import { Button, Modal } from '@/components/ui';
import { Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Send, Book } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const INACTIVITY_WARNING_TIME = 240; // 4 minutos en segundos
const INACTIVITY_LIMIT_TIME = 300; // 5 minutos en segundos

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentEmail = searchParams.get('email');
  const studentName = searchParams.get('name');
  const courseId = searchParams.get('courseId');
  
  const [exam, setExam] = useState(null);
  const [course, setCourse] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [inactivityTime, setInactivityTime] = useState(0);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [visibilityWarnings, setVisibilityWarnings] = useState(0);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  
  const timerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isProcessingVisibilityRef = useRef(false);
  const examRef = useRef(null);
  const answersRef = useRef({});

  useEffect(() => {
    if (!studentEmail || !studentName) {
      router.push('/exams/access');
      return;
    }
    loadExam();
    setupAntiCheat();

    return () => {
      cleanup();
    };
  }, [studentEmail, studentName]);

  useEffect(() => {
    if (timeRemaining > 0 && !submitting) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, submitting]);

  // Monitoreo de inactividad
  useEffect(() => {
    inactivityTimerRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = Math.floor((now - lastActivityRef.current) / 1000);
      setInactivityTime(timeSinceLastActivity);

      if (timeSinceLastActivity >= INACTIVITY_LIMIT_TIME) {
        handleAutoSubmit('inactivity');
      } else if (timeSinceLastActivity >= INACTIVITY_WARNING_TIME && !showInactivityWarning) {
        setShowInactivityWarning(true);
        setShowInactivityModal(true);
      }
    }, 1000);

    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [showInactivityWarning]);

  const setupAntiCheat = () => {
    // Deshabilitar copiar y pegar
    const preventCopyPaste = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    // Detectar cambio de ventana/tab
    const handleVisibilityChange = () => {
      if (document.hidden && !isProcessingVisibilityRef.current) {
        isProcessingVisibilityRef.current = true;
        
        setTimeout(() => {
          isProcessingVisibilityRef.current = false;
        }, 2000);
        
        setVisibilityWarnings(prev => {
          const newCount = prev + 1;
          console.log('Visibility warnings count:', newCount);
          
          if (newCount >= 3) {
            console.log('3 warnings reached, triggering auto-submit');
            // Bloquear interfaz inmediatamente
            setAutoSubmitting(true);
            // Limpiar listeners inmediatamente
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Auto-enviar por violaciones
            setTimeout(() => handleAutoSubmit('visibility_violations'), 100);
          } else {
            setShowVisibilityModal(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Click derecho deshabilitado
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  };

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
  };

  const resetInactivity = () => {
    lastActivityRef.current = Date.now();
    setInactivityTime(0);
    setShowInactivityWarning(false);
    setShowInactivityModal(false);
  };

  const loadExam = async () => {
    try {
      const examResult = await getDocumentById('exams', params.examId);
      if (examResult.success) {
        setExam(examResult.data);
        examRef.current = examResult.data;
        setTimeRemaining(examResult.data.timeLimit * 60);
        
        // Cargar documentación del curso
        if (courseId) {
          const courseResult = await getDocumentById('courses', courseId);
          if (courseResult.success) {
            setCourse(courseResult.data);
          }
        }
        
        // Crear intento de examen
        const attemptResult = await createExamAttempt(params.examId, studentEmail);
        if (attemptResult.success) {
          setAttemptId(attemptResult.id);
          // Guardar nombre del estudiante
          await updateExamAttempt(attemptResult.id, { studentName });
        }
      }
    } catch (error) {
      console.error('Error loading exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    resetInactivity();
    const newAnswers = {
      ...answers,
      [questionId]: optionIndex
    };
    setAnswers(newAnswers);
    answersRef.current = newAnswers;
  };

  const handleAutoSubmit = async (reason = 'timeout') => {
    console.log('handleAutoSubmit called with reason:', reason);
    console.log('Current submitting state:', submitting);
    console.log('Exam exists:', !!exam);
    console.log('Questions exist:', exam?.questions?.length);
    
    cleanup();
    await submitExam(true, reason);
  };

  const handleSubmit = async () => {
    setShowConfirmSubmitModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmSubmitModal(false);
    cleanup();
    await submitExam(false, 'manual');
  };

  const submitExam = async (autoSubmit = false, reason = 'manual') => {
    const currentExam = examRef.current || exam;
    const currentAnswers = answersRef.current || answers;
    
    if (submitting || !currentExam || !currentExam.questions) {
      console.log('Cannot submit:', { submitting, hasExam: !!currentExam, hasQuestions: !!currentExam?.questions });
      return;
    }
    setSubmitting(true);

    try {
      // Calcular puntaje
      let correctAnswers = 0;
      const totalQuestions = currentExam.questions.length;

      currentExam.questions.forEach(question => {
        const studentAnswer = currentAnswers[question.id];
        if (studentAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = (correctAnswers / totalQuestions) * 5.0;

      console.log('Submitting exam...', { attemptId, score, reason });

      // Actualizar intento con respuestas y puntaje
      if (attemptId) {
        await updateExamAttempt(attemptId, {
          answers: answers,
          submittedAt: new Date(),
          score: score,
          status: 'submitted',
          autoSubmitted: autoSubmit,
          submissionReason: reason,
          visibilityWarnings: visibilityWarnings
        });

        // Generar retroalimentación con IA (sin bloquear la redirección)
        fetch('/api/generate-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId,
            examId: params.examId,
            studentEmail,
            answers,
            score
          })
        }).catch(err => console.error('Error generating feedback:', err));
      }

      // Redirigir a página de éxito inmediatamente
      console.log('Redirecting to submitted page...');
      router.push(`/exams/${params.examId}/submitted?score=${score.toFixed(2)}`);

    } catch (error) {
      console.error('Error submitting exam:', error);
      setAutoSubmitting(false);
      setSubmitting(false);
      alert('Error al enviar el examen. Por favor intenta nuevamente.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (exam.timeLimit * 60)) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400';
    if (percentage > 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400 animate-pulse';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando examen...</p>
        </div>
      </div>
    );
  }

  if (autoSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Examen Finalizado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Se detectaron 3 cambios de ventana. El examen se está enviando automáticamente...
          </p>
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Examen no disponible
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se pudo cargar el examen correctamente
          </p>
          <Button onClick={() => router.push('/exams/access')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con Timer */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pregunta {currentQuestion + 1} de {exam.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Botón Documentación */}
              {course && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentation(true)}
                >
                  <Book className="w-4 h-4 mr-2" />
                  Documentación
                </Button>
              )}
              
              <div className="text-right">
                <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
                  <Clock className="inline w-5 h-5 mr-1" />
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs text-gray-500">Tiempo restante</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progreso</span>
              <span>{answeredCount}/{exam.questions.length} respondidas</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Alertas de Seguridad */}
          {visibilityWarnings > 0 && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-400">
              ⚠️ Advertencias de cambio de ventana: {visibilityWarnings}/3 (Se auto-enviará al alcanzar 3)
            </div>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          {/* Question Number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              Pregunta {currentQuestion + 1}
            </span>
            {answers[question.id] !== undefined && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                    answers[question.id] === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-gray-900 dark:text-white pt-1">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[exam.questions[index].id] !== undefined
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion < exam.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Examen
                </>
              )}
            </Button>
          )}
        </div>

        {/* Warning if not all answered */}
        {currentQuestion === exam.questions.length - 1 && answeredCount < exam.questions.length && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Te faltan preguntas por responder</p>
                <p className="text-sm">Has respondido {answeredCount} de {exam.questions.length} preguntas</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Confirmación de Envío */}
      <Modal
        isOpen={showConfirmSubmitModal}
        onClose={() => setShowConfirmSubmitModal(false)}
        title="Confirmar Envío"
      >
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                ¿Estás seguro de enviar el examen?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No podrás modificar tus respuestas después de enviarlo.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Has respondido <strong>{answeredCount}</strong> de <strong>{exam.questions.length}</strong> preguntas.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmSubmitModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={confirmSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              Sí, Enviar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Advertencia de Inactividad */}
      <Modal
        isOpen={showInactivityModal}
        onClose={resetInactivity}
        title="⚠️ Advertencia de Inactividad"
      >
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Has estado inactivo durante {Math.floor(inactivityTime / 60)} minutos.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Si la inactividad supera los 5 minutos, el examen se enviará automáticamente con las respuestas actuales.
            </p>
          </div>
          <Button onClick={resetInactivity} className="w-full">
            Continuar Examen
          </Button>
        </div>
      </Modal>

      {/* Modal: Cambio de Ventana Detectado */}
      <Modal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        title="⚠️ Cambio de Ventana Detectado"
      >
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Se ha detectado que cambiaste de ventana o pestaña.
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">
              Advertencia {visibilityWarnings}/3
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Al alcanzar 3 advertencias, el examen se enviará automáticamente.
            </p>
          </div>
          <Button onClick={() => setShowVisibilityModal(false)} className="w-full">
            Entendido
          </Button>
        </div>
      </Modal>

      {/* Modal: Documentación del Curso */}
      <Modal
        isOpen={showDocumentation}
        onClose={() => setShowDocumentation(false)}
        title={`📚 Documentación: ${course?.name || ''}`}
        size="2xl"
        fullHeight
      >
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {course && course.sessions ? (
            <div className="space-y-6">
              {course.sessions.filter(s => s.documentation).map((session, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Sesión {index + 1}: {session.title}
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {session.documentation}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No hay documentación disponible</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
