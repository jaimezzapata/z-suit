'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import { ThemeSelector } from '@/components/ThemeSelector';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, registerWithEmail, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar tema guardado
  useEffect(() => {
    const savedHue = localStorage.getItem('theme-hue');
    const savedScheme = localStorage.getItem('theme-scheme');
    const savedIntensity = localStorage.getItem('theme-intensity');
    
    if (savedHue) {
      document.documentElement.style.setProperty('--theme-hue', savedHue);
    }
    
    if (savedScheme && savedHue) {
      // Calcular colores secundarios según el esquema
      const hue = parseInt(savedHue);
      let secondary = hue;
      let tertiary = hue;
      
      switch (savedScheme) {
        case 'complementario':
          secondary = (hue + 180) % 360;
          tertiary = hue;
          break;
        case 'analogico':
          secondary = (hue + 30) % 360;
          tertiary = (hue - 30 + 360) % 360;
          break;
        case 'triadico':
          secondary = (hue + 120) % 360;
          tertiary = (hue + 240) % 360;
          break;
      }
      
      document.documentElement.style.setProperty('--theme-hue-secondary', secondary.toString());
      document.documentElement.style.setProperty('--theme-hue-tertiary', tertiary.toString());
    }
    
    if (savedIntensity) {
      // Aplicar intensidad guardada
      const intensities = {
        'neon': { saturation: 100, lightness: 50 },
        'vibrante': { saturation: 85, lightness: 55 },
        'normal': { saturation: 65, lightness: 60 },
        'pastel': { saturation: 40, lightness: 70 },
        'suave': { saturation: 25, lightness: 75 },
      };
      
      const intensity = intensities[savedIntensity] || intensities['neon'];
      document.documentElement.style.setProperty('--intensity-saturation', `${intensity.saturation}%`);
      document.documentElement.style.setProperty('--intensity-lightness', `${intensity.lightness}%`);
    }
  }, []);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    const result = await loginWithGoogle();
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Error al iniciar sesión con Google');
    }
    
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    
    if (isLogin) {
      result = await loginWithEmail(email, password);
    } else {
      if (!displayName.trim()) {
        setError('El nombre es requerido');
        setLoading(false);
        return;
      }
      result = await registerWithEmail(email, password, displayName);
    }

    if (result.success) {
      router.push('/dashboard');
    } else {
      const errorMessages = {
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/user-not-found': 'Usuario no encontrado. ¿Necesitas registrarte?',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/email-already-in-use': 'Este correo ya está registrado',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/invalid-credential': 'Usuario no existe. Ve a la pestaña "Registrarse" para crear una cuenta',
        'auth/missing-password': 'La contraseña es requerida',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      };
      
      setError(errorMessages[result.error] || `Error: ${result.error}`);
      console.error('Error de autenticación:', result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-darkest)] px-4">
      {/* Theme Selector - Posición absoluta */}
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-[var(--accent-primary)] mb-2">
            &gt; Z-SUIT_
          </h1>
          <p className="text-[var(--text-secondary)]">
            Plataforma Educativa para Profesores
          </p>
        </div>

        <Card padding={false} className="overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border-color)]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-medium transition-all ${
                isLogin
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-medium transition-all ${
                !isLogin
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Registrarse
            </button>
          </div>

          <div className="p-6">
            {/* Google Login */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={loading}
              loading={loading}
              className="w-full mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--bg-medium)] text-[var(--text-tertiary)]">
                  o continúa con email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Jaime Zapata"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  disabled={loading}
                />
              )}

              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              {error && (
                <div className="bg-[var(--bg-dark)] border-2 border-[var(--accent-primary)] rounded-lg p-3">
                  <p className="text-sm text-[var(--accent-primary)] font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </form>
          </div>
        </Card>

        <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
          Solo para profesores autorizados
        </p>
      </div>
    </div>
  );
}
