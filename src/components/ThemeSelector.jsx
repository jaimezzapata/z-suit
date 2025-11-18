'use client';

import { useState, useEffect } from 'react';

const PRESET_COLORS = [
  { name: 'Verde Matrix', hue: 135, color: '#00FF41' },
  { name: 'Azul Cibernético', hue: 200, color: '#0099FF' },
  { name: 'Magenta', hue: 320, color: '#FF0099' },
  { name: 'Oro', hue: 45, color: '#FFD700' },
  { name: 'Naranja Neón', hue: 15, color: '#FF4500' },
  { name: 'Púrpura', hue: 270, color: '#9933FF' },
  { name: 'Cian', hue: 180, color: '#00FFFF' },
  { name: 'Rosa', hue: 330, color: '#FF1493' },
];

const COLOR_SCHEMES = [
  { 
    id: 'monocromatico', 
    name: 'Monocromático',
    description: 'Un solo color en diferentes tonalidades',
    icon: '●'
  },
  { 
    id: 'complementario', 
    name: 'Complementario',
    description: 'Dos colores opuestos en el círculo cromático',
    icon: '●●'
  },
  { 
    id: 'analogico', 
    name: 'Análogo',
    description: 'Colores adyacentes en el círculo cromático',
    icon: '●●●'
  },
  { 
    id: 'triadico', 
    name: 'Triádico',
    description: 'Tres colores equidistantes',
    icon: '▲'
  },
];

const COLOR_INTENSITIES = [
  {
    id: 'neon',
    name: 'Neón',
    saturation: 100,
    lightness: 50,
    description: 'Colores brillantes y vibrantes'
  },
  {
    id: 'vibrante',
    name: 'Vibrante',
    saturation: 85,
    lightness: 55,
    description: 'Colores vivos pero equilibrados'
  },
  {
    id: 'normal',
    name: 'Normal',
    saturation: 65,
    lightness: 60,
    description: 'Colores balanceados'
  },
  {
    id: 'pastel',
    name: 'Pastel',
    saturation: 40,
    lightness: 70,
    description: 'Colores suaves y delicados'
  },
  {
    id: 'suave',
    name: 'Suave',
    saturation: 25,
    lightness: 75,
    description: 'Colores muy tenues'
  },
];

export function ThemeSelector({ className = '' }) {
  const [currentHue, setCurrentHue] = useState(135);
  const [colorScheme, setColorScheme] = useState('monocromatico');
  const [intensity, setIntensity] = useState('neon');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedHue = localStorage.getItem('theme-hue');
    const savedScheme = localStorage.getItem('theme-scheme');
    const savedIntensity = localStorage.getItem('theme-intensity');
    
    if (savedHue) {
      setCurrentHue(parseInt(savedHue));
    }
    if (savedScheme) {
      setColorScheme(savedScheme);
    }
    if (savedIntensity) {
      setIntensity(savedIntensity);
    }
    
    applyTheme(
      parseInt(savedHue) || 135, 
      savedScheme || 'monocromatico',
      savedIntensity || 'neon'
    );
  }, []);

  const calculateSecondaryColors = (baseHue, scheme) => {
    let secondary = baseHue;
    let tertiary = baseHue;

    switch (scheme) {
      case 'complementario':
        // Color opuesto (180° en el círculo)
        secondary = (baseHue + 180) % 360;
        tertiary = baseHue;
        break;
      case 'analogico':
        // Colores adyacentes (±30°)
        secondary = (baseHue + 30) % 360;
        tertiary = (baseHue - 30 + 360) % 360;
        break;
      case 'triadico':
        // Tres colores equidistantes (120° cada uno)
        secondary = (baseHue + 120) % 360;
        tertiary = (baseHue + 240) % 360;
        break;
      default: // monocromatico
        secondary = baseHue;
        tertiary = baseHue;
    }

    return { secondary, tertiary };
  };

  const applyTheme = (hue, scheme, intensityId) => {
    const { secondary, tertiary } = calculateSecondaryColors(hue, scheme);
    const intensityConfig = COLOR_INTENSITIES.find(i => i.id === intensityId) || COLOR_INTENSITIES[0];
    
    document.documentElement.style.setProperty('--theme-hue', hue.toString());
    document.documentElement.style.setProperty('--theme-hue-secondary', secondary.toString());
    document.documentElement.style.setProperty('--theme-hue-tertiary', tertiary.toString());
    document.documentElement.style.setProperty('--intensity-saturation', `${intensityConfig.saturation}%`);
    document.documentElement.style.setProperty('--intensity-lightness', `${intensityConfig.lightness}%`);
    
    localStorage.setItem('theme-hue', hue.toString());
    localStorage.setItem('theme-scheme', scheme);
    localStorage.setItem('theme-intensity', intensityId);
  };

  const handlePresetClick = (hue) => {
    setCurrentHue(hue);
    applyTheme(hue, colorScheme, intensity);
    setIsOpen(false);
  };

  const handleCustomChange = (e) => {
    const hue = parseInt(e.target.value);
    setCurrentHue(hue);
    applyTheme(hue, colorScheme, intensity);
  };

  const handleSchemeChange = (scheme) => {
    setColorScheme(scheme);
    applyTheme(currentHue, scheme, intensity);
  };

  const handleIntensityChange = (intensityId) => {
    setIntensity(intensityId);
    applyTheme(currentHue, colorScheme, intensityId);
  };

  const intensityConfig = COLOR_INTENSITIES.find(i => i.id === intensity) || COLOR_INTENSITIES[0];
  const currentColor = `hsl(${currentHue}, ${intensityConfig.saturation}%, ${intensityConfig.lightness}%)`;
  const { secondary, tertiary } = calculateSecondaryColors(currentHue, colorScheme);
  const secondaryColor = `hsl(${secondary}, ${intensityConfig.saturation}%, ${intensityConfig.lightness}%)`;
  const tertiaryColor = `hsl(${tertiary}, ${intensityConfig.saturation}%, ${intensityConfig.lightness}%)`;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-medium)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-all"
        title="Cambiar tema de color"
      >
        <div className="flex gap-1">
          <div 
            className="w-4 h-4 rounded-full border border-[var(--text-primary)]"
            style={{ backgroundColor: currentColor }}
          />
          {colorScheme !== 'monocromatico' && (
            <>
              <div 
                className="w-4 h-4 rounded-full border border-[var(--text-primary)]"
                style={{ backgroundColor: secondaryColor }}
              />
              {(colorScheme === 'analogico' || colorScheme === 'triadico') && (
                <div 
                  className="w-4 h-4 rounded-full border border-[var(--text-primary)]"
                  style={{ backgroundColor: tertiaryColor }}
                />
              )}
            </>
          )}
        </div>
        <span className="text-sm text-[var(--text-secondary)]">Tema</span>
        <svg 
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-96 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg shadow-2xl z-50 p-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Seleccionar Tema
            </h3>

            {/* Intensidad de Color */}
            <div className="mb-6">
              <p className="text-xs text-[var(--text-secondary)] mb-3 uppercase font-medium">
                Intensidad de Color
              </p>
              <div className="flex gap-2">
                {COLOR_INTENSITIES.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => handleIntensityChange(int.id)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg border transition-all text-xs font-medium
                      ${intensity === int.id 
                        ? 'border-[var(--accent-primary)] bg-[var(--bg-medium)] text-[var(--text-primary)]' 
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-light)]'
                      }
                    `}
                    title={int.description}
                  >
                    {int.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Esquemas de Color */}
            <div className="mb-6">
              <p className="text-xs text-[var(--text-secondary)] mb-3 uppercase font-medium">
                Esquema de Colores
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleSchemeChange(scheme.id)}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all
                      ${colorScheme === scheme.id 
                        ? 'border-[var(--accent-primary)] bg-[var(--bg-medium)]' 
                        : 'border-[var(--border-color)] hover:border-[var(--border-light)]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{scheme.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {scheme.name}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {scheme.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview de Colores */}
            <div className="mb-4 p-3 bg-[var(--bg-medium)] rounded-lg border border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)] mb-2 uppercase font-medium">
                Vista Previa
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div 
                    className="w-full h-12 rounded-lg border-2 border-[var(--text-primary)]"
                    style={{ backgroundColor: currentColor }}
                  />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 text-center">Primario</p>
                </div>
                {colorScheme !== 'monocromatico' && (
                  <div className="flex-1">
                    <div 
                      className="w-full h-12 rounded-lg border-2 border-[var(--text-primary)]"
                      style={{ backgroundColor: secondaryColor }}
                    />
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 text-center">Secundario</p>
                  </div>
                )}
                {(colorScheme === 'analogico' || colorScheme === 'triadico') && (
                  <div className="flex-1">
                    <div 
                      className="w-full h-12 rounded-lg border-2 border-[var(--text-primary)]"
                      style={{ backgroundColor: tertiaryColor }}
                    />
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 text-center">Terciario</p>
                  </div>
                )}
              </div>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <p className="text-xs text-[var(--text-secondary)] mb-2 uppercase font-medium">
                Colores Predefinidos
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hue}
                    onClick={() => handlePresetClick(preset.hue)}
                    className={`
                      aspect-square rounded-lg border-2 transition-all hover:scale-110
                      ${currentHue === preset.hue ? 'border-[var(--text-primary)] ring-2 ring-[var(--accent-primary)]' : 'border-[var(--border-color)]'}
                    `}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-2 uppercase font-medium">
                Color Personalizado
              </p>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={currentHue}
                  onChange={handleCustomChange}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, 100%, 50%), 
                      hsl(60, 100%, 50%), 
                      hsl(120, 100%, 50%), 
                      hsl(180, 100%, 50%), 
                      hsl(240, 100%, 50%), 
                      hsl(300, 100%, 50%), 
                      hsl(360, 100%, 50%)
                    )`
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-[var(--text-primary)]"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-sm text-[var(--text-secondary)] font-mono">
                      HUE: {currentHue}°
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentHue(135);
                      setColorScheme('monocromatico');
                      setIntensity('neon');
                      applyTheme(135, 'monocromatico', 'neon');
                    }}
                    className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-tertiary)] text-center">
                El tema se guarda automáticamente
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
