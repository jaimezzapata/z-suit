'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, BookOpen, Brain, Github, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeSelector } from '@/components/ThemeSelector';

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Cursos', path: '/dashboard/courses' },
    { icon: Brain, label: 'Exámenes', path: '/dashboard/exams' },
    { icon: Github, label: 'GitHub', path: '/dashboard/github' },
  ];

  // Añadir Admin solo para superadmins
  if (user?.role === 'superadmin') {
    navItems.push({ icon: Shield, label: 'Admin', path: '/dashboard/admin' });
  }

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-[var(--bg-dark)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Navigation */}
          <div className="flex items-center gap-8">
            <h1 
              className="text-2xl font-bold font-mono text-[var(--accent-primary)] cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              &gt; Z-SUIT_
            </h1>
            
            {/* Nav Links */}
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'bg-[var(--bg-medium)] text-[var(--accent-primary)] border border-[var(--accent-primary)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-medium)]'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <div className="text-right hidden sm:block">
              <p className="text-sm text-[var(--text-primary)] font-medium">
                {user?.displayName || 'Profesor'}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {user?.email}
              </p>
            </div>
            
            {/* Avatar */}
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--accent-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.displayName?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
