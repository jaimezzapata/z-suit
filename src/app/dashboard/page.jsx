'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BookOpen, Brain, Github, Rocket } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { DashboardNav } from '@/components/DashboardNav';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Debug: Ver datos del usuario
  useEffect(() => {
    if (user) {
      console.log('Usuario en dashboard:', {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)]">
      <DashboardNav />

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
            title={<div className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Documentación</div>}
            subtitle="Gestiona el material de estudio"
            variant="primary"
            className="hover:scale-105 cursor-pointer transition-transform hover:border-[var(--accent-primary)]"
          >
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Crea y edita documentación en Markdown para tus cursos.
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={() => router.push('/dashboard/courses')}
            >
              Ir a Cursos
            </Button>
          </Card>

          <Card 
            title={<div className="flex items-center gap-2"><Brain className="w-5 h-5" /> Evaluación IA</div>}
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
            title={<div className="flex items-center gap-2"><Github className="w-5 h-5" /> GitHub Grader</div>}
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
        <Card title={<div className="flex items-center gap-2"><Rocket className="w-5 h-5" /> Comenzar</div>} className="mt-8">
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
