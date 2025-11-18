'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, BookOpen, Edit, Trash2, Copy, Link2, Eye, EyeOff, Users, FileText, GraduationCap, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, Modal, ConfirmDialog } from '@/components/ui';
import { DashboardNav } from '@/components/DashboardNav';
import { createCourse, getCoursesByProfesor, deleteCourse, updateCourse } from '@/lib/firebase/firestore';

export default function CoursesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nivel: '1',
    description: '',
    tipo: 'regular', // 'regular' (18 sesiones) o 'empresarial' (7 sesiones)
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (user?.uid) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    setLoading(true);
    const result = await getCoursesByProfesor(user.uid);
    if (result.success) {
      // Migrar cursos sin accessCode o slug
      const coursesWithCodes = result.data.map(course => {
        if (!course.accessCode) {
          // Generar código si no existe
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let code = '';
          for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          course.accessCode = code;
          
          // Actualizar en Firestore
          updateCourse(course.id, { 
            accessCode: code,
            slug: course.slug || course.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            isPublic: course.isPublic !== undefined ? course.isPublic : true
          });
        }
        return course;
      });
      setCourses(coursesWithCodes);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createCourse(user.uid, formData);
    
      if (result.success) {
      toast.success('Curso creado exitosamente');
      await loadCourses();
      setShowModal(false);
      setFormData({ name: '', nivel: '1', description: '', tipo: 'regular' });
    } else {
      toast.error('Error al crear el curso: ' + result.error);
    }
    
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    
    const result = await deleteCourse(courseToDelete);
    if (result.success) {
      toast.success('Curso eliminado');
      await loadCourses();
    } else {
      toast.error('Error al eliminar: ' + result.error);
    }
  };

  const togglePublic = async (courseId, currentStatus) => {
    const result = await updateCourse(courseId, { isPublic: !currentStatus });
    if (result.success) {
      toast.success(currentStatus ? 'Curso ahora es privado' : 'Curso ahora es público');
      await loadCourses();
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado al portapapeles`);
  };

  const getPublicUrl = (course) => {
    const baseUrl = window.location.origin;
    if (!course.accessCode) return baseUrl + '/curso';
    return course.isPublic 
      ? `${baseUrl}/curso-publico/${course.slug}`
      : `${baseUrl}/curso/${course.accessCode}`;
  };

  const startEdit = (course) => {
    setEditingCourseId(course.id);
    setEditData({
      name: course.name,
      nivel: course.nivel,
      description: course.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingCourseId(null);
    setEditData({});
  };

  const saveEdit = async (courseId) => {
    const result = await updateCourse(courseId, {
      name: editData.name,
      nivel: editData.nivel,
      description: editData.description,
      slug: editData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });

    if (result.success) {
      toast.success('Curso actualizado');
      await loadCourses();
      setEditingCourseId(null);
      setEditData({});
    } else {
      toast.error('Error al actualizar: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)]">
      <DashboardNav />
      
      {/* Page Header */}
      <div className="bg-[var(--bg-dark)] border-b border-[var(--border-color)] px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Mis Cursos
            </h1>
            <p className="text-[var(--text-secondary)]">
              Gestiona tus cursos y contenido académico
            </p>
          </div>
          <Button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <div className="text-center text-[var(--text-secondary)] py-12">
            Cargando cursos...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-[var(--text-secondary)] mb-4" />
            <p className="text-[var(--text-secondary)] mb-4">
              No tienes cursos creados aún
            </p>
            <Button onClick={() => setShowModal(true)}>
              Crear mi primer curso
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {courses.map((course) => {
              const sessionsCompleted = course.sessions?.filter(s => s.documentation).length || 0;
              const totalSessions = 18;
              const progressPercent = (sessionsCompleted / totalSessions) * 100;
              
              return (
                <div 
                  key={course.id}
                  className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-all duration-200 overflow-hidden"
                >
                  <div className="flex items-stretch">
                    {/* Icono/Imagen Izquierda */}
                    <div className="w-32 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-16 h-16 text-white opacity-90" />
                    </div>

                    {/* Contenido Central */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              {editingCourseId === course.id ? (
                                <input
                                  type="text"
                                  value={editData.name}
                                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                                  className="text-2xl font-bold text-[var(--text-primary)] bg-transparent outline-none border-b-2 border-[var(--accent-primary)] w-full"
                                  autoFocus
                                />
                              ) : (
                                <h3 
                                  className="text-2xl font-bold text-[var(--text-primary)] cursor-pointer hover:text-[var(--accent-primary)] transition-colors"
                                  onClick={() => startEdit(course)}
                                  title="Click para editar"
                                >
                                  {course.name}
                                </h3>
                              )}
                            </div>
                            {editingCourseId === course.id ? (
                              <select
                                value={editData.nivel}
                                onChange={(e) => setEditData({...editData, nivel: e.target.value})}
                                className="px-3 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-semibold rounded-full outline-none cursor-pointer"
                              >
                                <option value="1">Nivel 1</option>
                                <option value="2">Nivel 2</option>
                                <option value="3">Nivel 3</option>
                              </select>
                            ) : (
                              <span className="px-3 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-semibold rounded-full">
                                Nivel {course.nivel}
                              </span>
                            )}
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              course.isPublic 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {course.isPublic ? 'Público' : 'Privado'}
                            </span>
                          </div>
                          
                          
                          {editingCourseId === course.id ? (
                            <textarea
                              value={editData.description}
                              onChange={(e) => setEditData({...editData, description: e.target.value})}
                              className="w-full text-[var(--text-secondary)] text-sm bg-transparent outline-none border border-[var(--accent-primary)] rounded px-2 py-1 resize-none mb-3"
                              rows={2}
                              placeholder="Descripción del curso"
                            />
                          ) : (
                            course.description ? (
                              <p 
                                className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2 cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                                onClick={() => startEdit(course)}
                                title="Click para editar"
                              >
                                {course.description}
                              </p>
                            ) : (
                              <p 
                                className="text-[var(--text-secondary)]/50 text-sm mb-3 italic cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                                onClick={() => startEdit(course)}
                                title="Click para agregar descripción"
                              >
                                Sin descripción
                              </p>
                            )
                          )}

                          {/* Botones de edición o Estadísticas */}
                          {editingCourseId === course.id && (
                            <div className="flex items-center gap-2 mb-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(course.id)}
                                className="flex items-center gap-1 text-xs h-7"
                              >
                                <Check className="w-3 h-3" />
                                Guardar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                className="flex items-center gap-1 text-xs h-7"
                              >
                                <X className="w-3 h-3" />
                                Cancelar
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                              <FileText className="w-4 h-4" />
                              <span>{sessionsCompleted}/{totalSessions} sesiones</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                              <BookOpen className="w-4 h-4" />
                              <code className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--bg-darkest)] px-2 py-1 rounded">
                                {course.accessCode}
                              </code>
                            </div>
                          </div>

                          {/* Barra de progreso */}
                          <div className="mt-3">
                            <div className="h-2 bg-[var(--bg-darkest)] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Acciones Derecha */}
                    <div className="w-48 bg-[var(--bg-medium)] border-l border-[var(--border-color)] p-4 flex flex-col gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                        Gestionar
                      </Button>
                      
                      <button
                        onClick={() => togglePublic(course.id, course.isPublic)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2"
                      >
                        {course.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {course.isPublic ? 'Hacer Privado' : 'Hacer Público'}
                      </button>

                      <button
                        onClick={() => copyToClipboard(getPublicUrl(course), 'Link')}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2"
                      >
                        <Link2 className="w-4 h-4" />
                        Copiar Link
                      </button>

                      <button
                        onClick={() => copyToClipboard(course.accessCode, 'Código')}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar Código
                      </button>

                      <div className="flex-1"></div>

                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourseToDelete(course.id);
                          setShowDeleteDialog(true);
                        }}
                        className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Crear Curso */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({ name: '', nivel: '1', description: '', tipo: 'regular' });
        }}
        title="Nuevo Curso"
        size="2xl"
        fullHeight={true}
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
            {/* Columna Izquierda - Formulario */}
            <div className="space-y-4 overflow-y-auto pr-3">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                  placeholder="ej. React Avanzado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Tipo de Curso *
                </label>
                <select
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                >
                  <option value="regular">Regular (18 sesiones)</option>
                  <option value="empresarial">Empresarial (7 sesiones)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nivel (Semestre) *
                </label>
                <select
                  required
                  value={formData.nivel}
                  onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                  className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                >
                  <option value="1">Primer Semestre</option>
                  <option value="2">Segundo Semestre</option>
                  <option value="3">Tercer Semestre</option>
                  <option value="4">Cuarto Semestre</option>
                  <option value="5">Quinto Semestre</option>
                  <option value="6">Sexto Semestre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 resize-none transition-all"
                  placeholder="Describe brevemente los objetivos del curso..."
                />
              </div>
            </div>

            {/* Columna Derecha - Preview */}
            <div className="bg-[var(--bg-darkest)] rounded-lg p-4 overflow-y-auto border border-[var(--border-color)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--accent-primary)]" />
                Vista Previa
              </h3>
              
              {/* Preview Card - Mismo diseño que el listado */}
              <div className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                <div className="flex items-stretch">
                  {/* Icono Izquierda */}
                  <div className="w-20 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-10 h-10 text-white opacity-90" />
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-bold text-[var(--text-primary)]">
                        {formData.name || 'Nombre del Curso'}
                      </h4>
                      <span className="px-2 py-0.5 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-semibold rounded-full">
                        Nivel {formData.nivel}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        formData.tipo === 'empresarial' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {formData.tipo === 'empresarial' ? 'Empresarial' : 'Regular'}
                      </span>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                        Público
                      </span>
                    </div>
                    
                    {formData.description && (
                      <p className="text-[var(--text-secondary)] text-xs mb-2 line-clamp-2">
                        {formData.description}
                      </p>
                    )}

                    {/* Estadísticas */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <FileText className="w-3 h-3" />
                        <span>0/{formData.tipo === 'empresarial' ? '7' : '18'} sesiones</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <BookOpen className="w-3 h-3" />
                        <code className="text-xs font-mono text-[var(--accent-primary)] bg-[var(--bg-darkest)] px-1.5 py-0.5 rounded">
                          AUTO
                        </code>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-2">
                      <div className="h-1.5 bg-[var(--bg-darkest)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2 bg-[var(--bg-medium)] rounded text-xs text-[var(--text-secondary)]">
                💡 Se generará automáticamente un código de acceso único al crear el curso
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border-color)] mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                setFormData({ name: '', nivel: '1', description: '' });
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Creando...' : 'Crear Curso'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Eliminar Curso"
        message="¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer y se perderá todo el contenido asociado."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
