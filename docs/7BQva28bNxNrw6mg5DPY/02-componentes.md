---
course: Front 2
session: 2
title: Componentes
date: 2025-11-18T04:49:33.229Z
---

# Componentes ⚛️

## Concepto Core
> Los **componentes** son bloques de construcción reutilizables de la interfaz de usuario (UI), como piezas de un rompecabezas. Facilitan la creación de aplicaciones web organizadas, modulares y fáciles de mantener.

## Desglose Teórico

Los componentes son la base de la construcción de interfaces de usuario en frameworks como React.  Son esenciales para la modularidad y la reutilización del código.

### Componentes: Definición y Propósito
*   Un componente es una **pieza gráfica o de interfaz de usuario (UI)** que encapsula código HTML, CSS y JavaScript.
*   Su principal objetivo es:
    *   **Reutilización:** Usar la misma pieza en múltiples lugares de la aplicación.
    *   **Organización:** Dividir la interfaz en partes manejables.
    *   **Mantenibilidad:** Facilitar la actualización y el desarrollo del código.

### Reglas Fundamentales de los Componentes

Estos son los mandamientos a seguir:

1.  **PascalCase:** Los nombres de los componentes *SIEMPRE* se escriben usando `PascalCase` (Ej: `MiComponente`).
2.  **Singular:** Los componentes *SIEMPRE* se nombran en singular (Ej: `Producto`, no `Productos`).
3.  **Función:** Un componente *SIEMPRE* es una función (ya sea una función flecha o una función regular).
4.  **Importar/Exportar:** Un componente *SIEMPRE* se crea con la intención de ser importado y exportado para ser usado en otras partes de la aplicación.
5.  **Inmutabilidad (No Renombrar):** Un componente *NUNCA* se debe renombrar una vez que se ha definido (para evitar confusiones y problemas de importación).
6.  **Retorno:** Un componente *SIEMPRE* debe tener un `return`.

    *   El `return` dentro de paréntesis `()` indica que se está devolviendo código HTML.
    *   El `return` dentro de llaves `{}` indica que se está devolviendo código JavaScript (u otra lógica).

### Ejemplo Básico de Componente
```javascript
// Importamos React (necesario si no usas una importación implícita de React)
import React from 'react';

// Declaración del componente usando función flecha
function MiComponente() {
  // Retornamos código HTML
  return (
    <div>
      <h1>¡Hola, Mundo!</h1>
      <p>Este es mi primer componente.</p>
    </div>
  );
}

// Exportamos el componente para que pueda ser usado en otros archivos
export default MiComponente;
```

## Código Comentado

```javascript
// Importamos React (necesario en muchos casos, aunque Vite lo puede manejar implícitamente)
import React from 'react';

// Definimos el componente usando PascalCase
function Saludo({ nombre }) { // Recibimos una prop (propiedad) llamada 'nombre'
  // El return contiene código JSX (HTML dentro de JavaScript)
  return (
    <div>
      {/* Mostramos el valor de la prop 'nombre' */}
      <p>Hola, {nombre}!</p>
    </div>
  );
}

// Exportamos el componente para usarlo en otros archivos
export default Saludo;
```

## Trampas Comunes / Ojo al dato
*   **Errores de Sintaxis:** Olvidar el `return` o usar sintaxis de retorno incorrecta es un error común.
*   **Conflictos de Nombres:** No usar `PascalCase` para nombrar los componentes, lo que puede causar errores en la importación/exportación.
*   **Mala Estructura:** No dividir la UI en componentes más pequeños puede llevar a código desorganizado y difícil de mantener.
*   **Props:** Recuerda que las `props` (abreviatura de propiedades) son la forma en que los componentes reciben datos y configuran su comportamiento.

## Resumen Flash (TL;DR)

| Característica             | Descripción                                                                 | Ejemplo                            |
| -------------------------- | --------------------------------------------------------------------------- | --------------------------------- |
| **Nombre**                 | `PascalCase` (e.g., `MiComponente`)                                          | `MiTarjetaDeProducto`             |
| **Tipo**                   | Función (flecha o regular)                                                  | `function MiComponente() { ... }` |
| **Retorno**                | JSX (HTML dentro de JavaScript)                                             | `return <div>...</div>`           |
| **Reutilización**          | Se pueden usar múltiples veces en la aplicación.                            | Varios `<MiComponente />`          |
| **Importación/Exportación** | Necesario para usar los componentes en otras partes de la aplicación.      | `import MiComponente from './...'` |
