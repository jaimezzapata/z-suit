'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    // Cargar tema guardado
    const savedHue = localStorage.getItem('theme-hue');
    const savedScheme = localStorage.getItem('theme-scheme');
    const savedIntensity = localStorage.getItem('theme-intensity');
    
    if (savedHue) {
      document.documentElement.style.setProperty('--theme-hue', savedHue);
    }
    
    if (savedScheme && savedHue) {
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

  return null;
}
