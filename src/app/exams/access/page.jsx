'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getExamByAccessCode, getExamAttemptsByStudent } from '@/lib/firebase/firestore';
import { Button, Input, Modal } from '@/components/ui';
import { Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function ExamAccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accessCode: '',
    studentEmail: '',
    studentName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar nombre completo
      if (formData.studentName.trim().split(' ').length < 2) {
        showError('Por favor ingresa tu nombre completo (nombre y apellido)');
        setLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.studentEmail)) {
        showError('Por favor ingresa un email válido');
        setLoading(false);
        return;
      }

      // Buscar examen por código de acceso
      const examResult = await getExamByAccessCode(formData.accessCode.toUpperCase());
      
      if (!examResult.success) {
        showError('Código de acceso inválido');
        setLoading(false);
        return;
      }

      const exam = examResult.data;

      // Verificar que el examen esté activo
      if (exam.status !== 'active') {
        showError('Este examen no está disponible actualmente');
        setLoading(false);
        return;
      }

      // Verificar si el estudiante ya presentó el examen
      const attemptsResult = await getExamAttemptsByStudent(exam.id, formData.studentEmail);
      
      if (attemptsResult.success && attemptsResult.data.length > 0) {
        showError('Ya has presentado este examen. Solo se permite un intento por estudiante.');
        setLoading(false);
        return;
      }

      // Verificar que el examen tenga preguntas
      if (!exam.questions || exam.questions.length === 0) {
        showError('Este examen aún no tiene preguntas configuradas');
        setLoading(false);
        return;
      }

      // Redirigir a la página de presentación del examen
      router.push(`/exams/${exam.id}/take?email=${encodeURIComponent(formData.studentEmail)}&name=${encodeURIComponent(formData.studentName)}&courseId=${exam.courseId}`);

    } catch (error) {
      console.error('Error accessing exam:', error);
      showError('Error al acceder al examen. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Acceso al Examen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ingresa tus datos para comenzar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Ej: Juan Pérez García"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Nombre y apellido completos
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tu Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.studentEmail}
                onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                placeholder="tu-email@ejemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Recibirás tu retroalimentación en este email
            </p>
          </div>

          {/* Código de Acceso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código de Acceso *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.accessCode}
                onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                placeholder="Ej: ABC12345"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider"
                maxLength={8}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              8 caracteres proporcionados por tu profesor
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Validando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Acceder al Examen
              </>
            )}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ℹ️ Información Importante
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Solo puedes presentar el examen una vez</li>
            <li>• El tiempo es limitado y no se puede pausar</li>
            <li>• No podrás copiar ni pegar durante el examen</li>
            <li>• No cambies de ventana o el examen se enviará automáticamente</li>
            <li>• Asegúrate de tener buena conexión a internet</li>
          </ul>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error de Acceso"
      >
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">{errorMessage}</p>
          </div>
          <Button onClick={() => setShowErrorModal(false)} className="w-full">
            Entendido
          </Button>
        </div>
      </Modal>
    </div>
  );
}
