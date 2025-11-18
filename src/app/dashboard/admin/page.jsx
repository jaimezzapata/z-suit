'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardNav } from '@/components/DashboardNav';
import { Button, Modal } from '@/components/ui';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from 'sonner';
import { 
  Trash2, 
  AlertTriangle, 
  Database, 
  BookOpen, 
  FileText,
  Shield,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    users: 0,
    exams: 0,
    sessions: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Verificar si es superadmin
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'superadmin') {
        toast.error('Acceso denegado: Solo superadministradores');
        router.push('/dashboard');
      } else {
        loadStats();
      }
    }
  }, [user, authLoading, router]);

  const loadStats = async () => {
    try {
      const [coursesSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'users'))
      ]);

      // Contar sesiones con documentación
      let sessionsCount = 0;
      coursesSnap.docs.forEach(doc => {
        const course = doc.data();
        if (course.sessions) {
          sessionsCount += course.sessions.filter(s => s.documentation).length;
        }
      });

      setStats({
        courses: coursesSnap.size,
        users: usersSnap.size,
        exams: 0, // Por implementar
        sessions: sessionsCount
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async (type) => {
    setDeleting(true);
    try {
      let collectionName = '';
      let deletedCount = 0;

      switch(type) {
        case 'courses':
          collectionName = 'courses';
          break;
        case 'exams':
          collectionName = 'exams';
          break;
        case 'users':
          // No eliminar superadmin
          const usersSnap = await getDocs(collection(db, 'users'));
          const batch = writeBatch(db);
          
          usersSnap.docs.forEach(docSnap => {
            const userData = docSnap.data();
            if (userData.role !== 'superadmin') {
              batch.delete(docSnap.ref);
              deletedCount++;
            }
          });
          
          await batch.commit();
          toast.success(`${deletedCount} usuarios eliminados (superadmins protegidos)`);
          await loadStats();
          setShowDeleteModal(false);
          setDeleting(false);
          return;
        
        default:
          throw new Error('Tipo de eliminación no válido');
      }

      // Eliminar colección completa
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(docSnap => {
        batch.delete(docSnap.ref);
        deletedCount++;
      });
      
      await batch.commit();
      toast.success(`${deletedCount} ${type} eliminados correctamente`);
      await loadStats();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Error al eliminar datos');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (type) => {
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'superadmin') {
    return null;
  }

  const deleteOptions = [
    {
      type: 'courses',
      title: 'Eliminar Todos los Cursos',
      description: 'Elimina todos los cursos y sus sesiones',
      icon: BookOpen,
      count: stats.courses,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      type: 'exams',
      title: 'Eliminar Todos los Exámenes',
      description: 'Elimina todos los exámenes creados',
      icon: FileText,
      count: stats.exams,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      type: 'users',
      title: 'Eliminar Todos los Usuarios',
      description: 'Elimina todos los usuarios (excepto superadmins)',
      icon: Shield,
      count: stats.users,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Panel de Superadministrador
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión avanzada y limpieza de datos del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cursos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.courses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sesiones</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.sessions}</p>
              </div>
              <FileText className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Exámenes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.exams}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
              </div>
              <Shield className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Zona de Peligro
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                Las acciones de eliminación son irreversibles. Usa con precaución.
              </p>
            </div>
          </div>
        </div>

        {/* Delete Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Acciones de Limpieza
          </h2>

          <div className="grid gap-4">
            {deleteOptions.map((option) => (
              <div
                key={option.type}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${option.bgColor}`}>
                      <option.icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {option.description}
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total: {option.count} registros
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => confirmDelete(option.type)}
                    disabled={option.count === 0}
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Todo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Stats */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={loadStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar Estadísticas
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        title="⚠️ Confirmar Eliminación"
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-900 dark:text-red-100 font-semibold">
              Esta acción es IRREVERSIBLE
            </p>
            <p className="text-sm text-red-800 dark:text-red-200 mt-2">
              Estás a punto de eliminar todos los {deleteType} del sistema.
              {deleteType === 'users' && ' Los superadministradores serán protegidos.'}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás completamente seguro de que deseas continuar?
          </p>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleDeleteAll(deleteType)}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sí, Eliminar Todo
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
