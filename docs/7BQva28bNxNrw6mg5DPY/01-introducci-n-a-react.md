---
course: Front 2
session: 1
title: Introducción a react
date: 2025-11-18T04:15:53.400Z
---

# Introducción a React ⚛️

## Concepto Core

> React es una **biblioteca de JavaScript** diseñada para construir interfaces de usuario (UI) de manera eficiente, permitiendo crear aplicaciones web dinámicas y de una sola página (SPA).

## Desglose Teórico

### UX/UI y el Desarrollo Web

- **UX (Experiencia de Usuario):** Se enfoca en cómo el usuario se siente al interactuar con el sitio web. Considera la usabilidad, accesibilidad y satisfacción general.
- **UI (Experiencia de Interfaz):** Se centra en la presentación visual del sitio web, incluyendo el diseño, los colores, la tipografía y la disposición de los elementos.

### Migración de Proyectos: De JavaScript Vanilla a React JS

- **JavaScript Vanilla:** JavaScript "puro", sin el uso de librerías o frameworks.
- **React JS:** Un framework de JavaScript que simplifica la creación de interfaces de usuario complejas.

### React JS: La Fundamentación

- **React como Librería:** Es una biblioteca (no un framework completo) que se enfoca en la capa de la interfaz de usuario (UI).
- **Aplicaciones SPA (Single Page Application):** Aplicaciones web que cargan una única página HTML y luego actualizan dinámicamente el contenido. React es ideal para construir este tipo de aplicaciones.
- **`index.html`:** React funciona principalmente dentro de un único archivo `index.html`, que actúa como el punto de entrada de la aplicación.
- **Componentes:** React está construido con componentes reutilizables, que son bloques de construcción de la interfaz de usuario.

### Buenas Prácticas de Nomenclatura

- **`camelCase`:** Usado para nombrar funciones y lógica de comportamiento. (ej: `calcularSuma`)
- **`PascalCase`:** Usado para nombrar componentes de React. (ej: `MiComponente`)
- **`kebab-case`:** Usado para nombrar proyectos (ej: `mi-proyecto-react`).
- **`camelCase` o `snake_case`:** Usado para nombrar variables dentro del proyecto. (ej: `nombreUsuario` o `nombre_usuario`).
- **Importante:** Evitar renombrar archivos en React, para mantener la consistencia.

### Creación de un Proyecto React: Pasos Esenciales

1.  **Abrir la Terminal:** Utilizar CMD o PowerShell (evitar GitBash). Asegurarse de estar en la ruta correcta.
2.  **`npm create vite@latest`:** Comando para crear un nuevo proyecto React usando Vite (una herramienta de construcción rápida). Necesita tener Node.js instalado.
3.  **Nombrar el Proyecto:** Usar `kebab-case` (ej: `mi-proyecto-react`).
4.  **Seleccionar React:** Elegir "React" como framework.
5.  **Seleccionar JavaScript:** Elegir una variante de JavaScript (ej: JavaScript, TypeScript, etc.).
6.  **`code "nombre del proyecto"`:** Abrir el proyecto en el editor de código.
7.  **Abrir una Terminal en el Editor:** Asegúrate de estar en el directorio raíz del proyecto.
8.  **`npm install`:** Instalar las dependencias del proyecto.
9.  **`npm run dev`:** Ejecutar el proyecto en modo de desarrollo.

## Código Comentado

(Este código es un ejemplo básico. Un proyecto React completo tendría más archivos y complejidad.)

```javascript
// Este es un ejemplo de un componente básico en React (usando JSX, que es una sintaxis similar a HTML).
function MiComponente() {
  // Aquí puedes agregar lógica de JavaScript.
  const saludo = "¡Hola, React!";

  // El `return` debe devolver JSX (el código que describe la interfaz de usuario).
  return (
    <div>
      <h1>{saludo}</h1> {/* Mostrar el saludo en un encabezado */}
      <p>Este es mi primer componente.</p>
    </div>
  );
}

// Para usar el componente, se renderiza en el archivo principal (normalmente `index.js` o `App.js`).
// Ejemplo de renderización (en otro archivo):
// import MiComponente from './MiComponente'; // Importar el componente
// function App() {
//   return (
//     <div>
//       <MiComponente /> {/* Utilizar el componente */}
//     </div>
//   );
// }
```

## Trampas Comunes / Ojo al dato

- **Diferencia entre Librería y Framework:** React es una librería enfocada en la UI. No proporciona todas las herramientas que ofrece un framework completo (como Angular o Vue).
- **Uso de `index.html`:** Aunque React funciona principalmente dentro de `index.html`, no manipula directamente el DOM (Modelo de Objetos del Documento) del archivo HTML; interactúa con un DOM virtual para optimizar las actualizaciones.
- **Convenciones de Nomenclatura:** Prestar atención a las convenciones: `PascalCase` para componentes es CRUCIAL. Errores en la nomenclatura pueden causar problemas.
- **`npm create vite@latest` vs. `create-react-app`:** `create-react-app` (CRA) ha sido descontinuado; usar Vite es la forma más moderna de crear un proyecto React.

## Resumen Flash (TL;DR)

| Concepto Clave               | Descripción                                                      | Nomenclatura Importante                |
| :--------------------------- | :--------------------------------------------------------------- | :------------------------------------- |
| **React**                    | Biblioteca para construir interfaces de usuario (UI).            | `PascalCase` (Componentes)             |
| **SPA**                      | Aplicación de una sola página; React es ideal para SPA.          | `kebab-case` (Nombre del Proyecto)     |
| **`index.html`**             | Punto de entrada principal de la aplicación.                     | `camelCase` (Funciones)                |
| **Componentes**              | Bloques de construcción reutilizables de la interfaz de usuario. | `camelCase` o `snake_case` (Variables) |
| **`npm create vite@latest`** | Comando para crear un nuevo proyecto React (usando Vite).        |                                        |
