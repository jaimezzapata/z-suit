'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDocumentById, getExamAttempts } from '@/lib/firebase/firestore';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui';
import { ArrowLeft, Mail, Download, TrendingUp, Users, Award, Clock } from 'lucide-react';

export default function ExamResultsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const examResult = await getDocumentById('exams', params.examId);
      if (examResult.success) {
        setExam(examResult.data);
        
        const attemptsResult = await getExamAttempts(params.examId);
        if (attemptsResult.success) {
          setAttempts(attemptsResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (attempts.length === 0) return null;
    
    const scores = attempts.map(a => a.score).filter(s => s !== null);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    return { average, highest, lowest, total: attempts.length };
  };

  const handleSendFeedback = async (attempt) => {
    if (!confirm(`¿Enviar retroalimentación por email a ${attempt.studentEmail}?`)) return;
    
    try {
      const response = await fetch('/api/send-feedback-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail: attempt.studentEmail,
          feedback: attempt.feedback,
          examTitle: exam.title,
          score: attempt.score
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Retroalimentación enviada por email');
      } else {
        alert('❌ Error al enviar email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar email');
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando resultados...</p>
          </div>
        </div>
      </>
    );
  }

  const stats = calculateStats();

  return (
    <>
      <DashboardNav />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Resultados: {exam?.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Código: <span className="font-mono font-bold">{exam?.accessCode}</span>
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Intentos</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Promedio</span>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.average.toFixed(2)}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Más Alta</span>
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.highest.toFixed(2)}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Más Baja</span>
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.lowest.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Attempts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Intentos de Estudiantes
            </h2>
          </div>

          {attempts.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No hay intentos registrados aún
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {attempt.studentName || attempt.studentEmail}
                        </span>
                        {attempt.autoSubmitted && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                            {attempt.submissionReason === 'timeout' ? '⏱️ Tiempo agotado' :
                             attempt.submissionReason === 'inactivity' ? '😴 Inactividad' :
                             attempt.submissionReason === 'visibility_violations' ? '👁️ Violaciones' :
                             'Auto-enviado'}
                          </span>
                        )}
                        {attempt.visibilityWarnings > 0 && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs">
                            ⚠️ {attempt.visibilityWarnings} advertencias
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {attempt.studentEmail}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(attempt.submittedAt?.toDate?.() || attempt.submittedAt).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${
                        attempt.score >= 4.0 
                          ? 'text-green-600 dark:text-green-400'
                          : attempt.score >= 3.0
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {attempt.score?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">/ 5.0</div>
                    </div>
                  </div>

                  {attempt.feedback && (
                    <div className="mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAttempt(selectedAttempt?.id === attempt.id ? null : attempt)}
                        className="mb-2"
                      >
                        {selectedAttempt?.id === attempt.id ? 'Ocultar' : 'Ver'} Retroalimentación
                      </Button>

                      {selectedAttempt?.id === attempt.id && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">
                            {attempt.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {attempt.feedback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendFeedback(attempt)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar por Email
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
