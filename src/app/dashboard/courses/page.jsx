'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, BookOpen, Edit, Trash2, Copy, Link2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, Modal, ConfirmDialog } from '@/components/ui';
import { DashboardNav } from '@/components/DashboardNav';
import { createCourse, getCoursesByProfesor, deleteCourse, updateCourse } from '@/lib/firebase/firestore';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nivel: '1',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
      setFormData({ name: '', nivel: '1', description: '' });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id}
                variant="primary"
                className="hover:scale-105 transition-transform"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                      {course.name}
                    </h3>
                    <span className="text-sm text-[var(--accent-primary)] font-medium">
                      {course.nivel}° Semestre
                    </span>
                  </div>
                  <button
                    onClick={() => togglePublic(course.id, course.isPublic)}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                    title={course.isPublic ? 'Público' : 'Privado (requiere código)'}
                  >
                    {course.isPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                
                {course.description && (
                  <p className="text-[var(--text-secondary)] text-sm mb-3">
                    {course.description}
                  </p>
                )}
                
                {/* Código de acceso y link */}
                <div className="bg-[var(--bg-darkest)] rounded-lg p-3 mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Código:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-[var(--accent-primary)]">
                        {course.accessCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(course.accessCode, 'Código')}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Link:</span>
                    <button
                      onClick={() => copyToClipboard(getPublicUrl(course), 'Link')}
                      className="flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"
                    >
                      <Link2 className="w-3 h-3" />
                      Copiar URL
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Gestionar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCourseToDelete(course.id);
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modal Crear Curso */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({ name: '', nivel: '1', description: '' });
        }}
        title="Nuevo Curso"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Nombre del Curso *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              placeholder="ej. React Avanzado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Nivel (Semestre) *
            </label>
            <select
              required
              value={formData.nivel}
              onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              <option value="1">Primer Semestre</option>
              <option value="2">Segundo Semestre</option>
              <option value="3">Tercer Semestre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              placeholder="Breve descripción del curso..."
            />
          </div>

          <div className="flex gap-3 pt-4">
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
