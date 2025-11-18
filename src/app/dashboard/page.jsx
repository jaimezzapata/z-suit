'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)]">
      {/* Header */}
      <header className="bg-[var(--bg-dark)] border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold font-mono text-[var(--accent-primary)]">
                &gt; Z-SUIT_
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeSelector />
              <div className="text-right">
                <p className="text-sm text-[var(--text-primary)] font-medium">
                  {user?.displayName || 'Profesor'}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.email}
                </p>
              </div>
              {user?.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)]"
                />
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Dashboard
          </h2>
          <p className="text-[var(--text-secondary)]">
            Bienvenido a tu espacio de trabajo, {user?.displayName?.split(' ')[0]}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            title="📚 Documentación" 
            subtitle="Gestiona el material de estudio"
            variant="primary"
            className="hover:scale-105 cursor-pointer transition-transform hover:border-[var(--accent-primary)]"
          >
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Crea y edita documentación en Markdown para tus cursos.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              Ir a Docs
            </Button>
          </Card>

          <Card 
            title="🧠 Evaluación IA" 
            subtitle="Exámenes con inteligencia artificial"
            variant="secondary"
            className="hover:scale-105 cursor-pointer transition-transform hover:border-[var(--accent-secondary)]"
          >
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Genera preguntas automáticamente y configura exámenes seguros.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              Crear Examen
            </Button>
          </Card>

          <Card 
            title="💻 GitHub Grader" 
            subtitle="Califica repositorios"
            variant="tertiary"
            className="hover:scale-105 cursor-pointer transition-transform hover:border-[var(--accent-tertiary)]"
          >
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Gestiona entregas de proyectos y envía feedback.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              Ver Entregas
            </Button>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-[var(--text-secondary)] text-sm mb-1">Cursos Activos</p>
            <p className="text-3xl font-bold text-[var(--accent-primary)]">0</p>
          </div>
          <div className="bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-[var(--text-secondary)] text-sm mb-1">Exámenes Creados</p>
            <p className="text-3xl font-bold text-[var(--accent-primary)]">0</p>
          </div>
          <div className="bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-[var(--text-secondary)] text-sm mb-1">Docs Publicadas</p>
            <p className="text-3xl font-bold text-[var(--accent-primary)]">0</p>
          </div>
          <div className="bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg p-4">
            <p className="text-[var(--text-secondary)] text-sm mb-1">Entregas Pendientes</p>
            <p className="text-3xl font-bold text-[var(--accent-primary)]">0</p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card title="🚀 Comenzar" className="mt-8">
          <ol className="space-y-3 text-[var(--text-secondary)]">
            <li className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent-primary)] font-bold">1.</span>
              <span>Crea tu primer curso desde la sección de cursos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent-primary)] font-bold">2.</span>
              <span>Agrega documentación en Markdown para tu curso</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent-primary)] font-bold">3.</span>
              <span>Genera preguntas con IA o crea un examen manualmente</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent-primary)] font-bold">4.</span>
              <span>Configura tareas de GitHub para recibir proyectos</span>
            </li>
          </ol>
        </Card>
      </main>
    </div>
  );
}
