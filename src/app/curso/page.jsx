'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { getCourseByAccessCode } from '@/lib/firebase/firestore';

export default function CourseAccessPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await getCourseByAccessCode(code);
    
    if (result.success) {
      router.push(`/curso/${code.toUpperCase()}`);
    } else {
      setError(result.error || 'Código no válido');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono text-[var(--accent-primary)] mb-2">
            &gt; Z-SUIT_
          </h1>
          <p className="text-[var(--text-secondary)]">
            Acceso a Curso
          </p>
        </div>

        <div className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Ingresa el código del curso
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: AB12CD"
                maxLength={6}
                className="w-full bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg px-4 py-3 text-center text-2xl font-mono text-[var(--text-primary)] tracking-wider focus:outline-none focus:border-[var(--accent-primary)] uppercase"
                required
              />
            </div>

            {error && (
              <div className="bg-[var(--bg-dark)] border border-[var(--accent-primary)] rounded-lg p-3 text-sm text-[var(--accent-primary)]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full"
            >
              {loading ? 'Verificando...' : 'Acceder al Curso'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            <p>¿No tienes un código?</p>
            <p className="mt-1">Solicítalo a tu profesor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
