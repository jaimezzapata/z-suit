'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createExam } from '@/lib/firebase/firestore';
import { Button, Input } from '@/components/ui';
import { Sparkles, Clock, FileQuestion, Shield } from 'lucide-react';

export default function ExamForm({ courses, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    timeLimit: 60,
    questionCount: 10,
    tolerance: 3,
    generateWithAI: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createExam(user.uid, formData);
      if (result.success) {
        onSuccess();
      } else {
        alert(result.error || 'Error al crear el examen');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el examen');
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === formData.courseId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Examen
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Examen Final - JavaScript"
              required
            />
          </div>

          {/* Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Curso
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - Nivel {course.nivel}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {selectedCourse.sessions.filter(s => s.documentation).length} sesiones con documentación disponible
              </p>
            )}
          </div>

          {/* Generación con IA */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="generateAI"
                checked={formData.generateWithAI}
                onChange={(e) => setFormData({ ...formData, generateWithAI: e.target.checked })}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="generateAI" className="flex items-center gap-2 font-medium text-gray-900 dark:text-white cursor-pointer">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Generar preguntas con IA
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  La IA analizará la documentación del curso y generará {formData.questionCount} preguntas de opción múltiple automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-6">
          {/* Número de preguntas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileQuestion className="w-4 h-4 inline mr-1" />
              Número de Preguntas
            </label>
            <Input
              type="number"
              min="5"
              max="50"
              value={formData.questionCount}
              onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Entre 5 y 50 preguntas
            </p>
          </div>

          {/* Tiempo límite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Tiempo Límite (minutos)
            </label>
            <Input
              type="number"
              min="10"
              max="180"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              De 10 a 180 minutos
            </p>
          </div>

          {/* Tolerancia fraude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              Tolerancia de Infracciones
            </label>
            <Input
              type="number"
              min="0"
              max="10"
              value={formData.tolerance}
              onChange={(e) => setFormData({ ...formData, tolerance: parseInt(e.target.value) })}
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Número de infracciones permitidas (0-10)
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          Características del examen:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>✓ Código de acceso único generado automáticamente</li>
          <li>✓ Sistema de proctoring con detección de cambio de pestaña</li>
          <li>✓ Modo fullscreen obligatorio durante el examen</li>
          <li>✓ Timer con cuenta regresiva visible</li>
          <li>✓ Calificación automática al finalizar</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Crear Examen
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
