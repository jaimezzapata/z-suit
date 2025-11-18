'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Sparkles } from 'lucide-react';

export default function TestGeminiPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testGemini = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: 'React Avanzado',
          sessionNumber: 1,
          sessionTitle: 'Introducción a React Hooks',
          keyTopics: 'useState, useEffect, reglas de los hooks'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.documentation);
      } else {
        setResult('❌ Error: ' + data.error);
      }
    } catch (error) {
      setResult('❌ Error de red: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          🧪 Prueba de Gemini AI
        </h1>

        <Button 
          onClick={testGemini} 
          disabled={loading}
          className="mb-6 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Generando...' : 'Probar Gemini'}
        </Button>

        {result && (
          <div className="bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Resultado:
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] font-mono">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
