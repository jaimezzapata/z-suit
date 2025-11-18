'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { CheckCircle, Mail } from 'lucide-react';

export default function ExamSubmittedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get('score');

  const getScoreColor = () => {
    const numScore = parseFloat(score);
    if (numScore >= 4.0) return 'text-green-600 dark:text-green-400';
    if (numScore >= 3.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = () => {
    const numScore = parseFloat(score);
    if (numScore >= 4.5) return '¡Excelente trabajo!';
    if (numScore >= 4.0) return '¡Muy bien!';
    if (numScore >= 3.0) return 'Buen esfuerzo';
    return 'Sigue practicando';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Examen Enviado!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tu examen ha sido enviado correctamente
        </p>

        {/* Score */}
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Tu calificación
          </p>
          <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
            {score}
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {getScoreMessage()}
          </p>
        </div>

        {/* Email Info */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3 text-left">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Retroalimentación enviada
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
                Recibirás un análisis detallado de tu desempeño en tu correo electrónico. 
                Tu profesor también tendrá acceso a tu retroalimentación.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <p>✅ Este examen solo podía presentarse una vez</p>
          <p>📧 Revisa tu correo para ver la retroalimentación completa</p>
          <p>👨‍🏫 Tu profesor puede ver tus resultados</p>
        </div>

        {/* Button */}
        <Button
          onClick={() => router.push('/exams/access')}
          className="w-full"
        >
          Finalizar
        </Button>
      </div>
    </div>
  );
}
