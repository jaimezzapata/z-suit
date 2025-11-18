# > Z-SUIT_

![Version](https://img.shields.io/badge/version-1.0.0--MVP-00FF41)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![Firebase](https://img.shields.io/badge/Firebase-BaaS-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

**Plataforma educativa enfocada en la productividad del profesor de tecnología.**

---

## 📖 Descripción

**Z-SUIT** es una suite de herramientas diseñada para optimizar el flujo de trabajo de profesores de tecnología, automatizando tareas repetitivas y centralizando la gestión académica. La plataforma combina tres módulos principales que resuelven problemas críticos del día a día docente:

1. **📚 Gestión de Documentación** - Sistema para crear y publicar material de estudio (Markdown → HTML)
2. **🧠 Evaluación con IA Segura** - Generador de exámenes con inteligencia artificial y sistema anti-fraude
3. **💻 Calificación de Repositorios** - Dashboard centralizado para evaluar proyectos de GitHub

---

## 🎯 Propósito

Reducir drásticamente el tiempo invertido en:
- Crear exámenes desde cero (generación automática con IA)
- Gestionar la integridad académica (proctoring por capas)
- Centralizar entregas de proyectos (repositorios GitHub en un solo lugar)
- Publicar documentación para estudiantes (Markdown simple → Web estilizada)

**Objetivo:** Permitir al profesor enfocarse en lo importante - enseñar - mientras Z-SUIT automatiza la logística.

---

## 🚀 Alcance del MVP (v1.0)

### Para Profesores (Admin)
- ✅ Autenticación segura (Google / Email)
- ✅ Crear y gestionar cursos/materias
- ✅ Editor de documentación en Markdown
- ✅ Generar documentación con IA (Gemini)
- ✅ Generar preguntas de examen con IA
- ✅ Configurar exámenes con códigos de acceso
- ✅ Dashboard de resultados con estadísticas
- ✅ Generación automática de retroalimentación con IA
- ✅ Crear tareas de GitHub
- ✅ Calificar y enviar feedback a estudiantes

### Para Estudiantes
- ✅ Acceder a documentación del curso (Markdown renderizado)
- ✅ Presentar exámenes en entorno seguro (anti-fraude)
- ✅ Consultar documentación durante exámenes
- ✅ Entregar repositorios de GitHub
- ✅ Recibir feedback por email

### Sistema de Proctoring (Anti-Cheat)
- ✅ Detección de pérdida de foco (cambio de pestaña/ventana)
- ✅ Sistema de advertencias (máximo 3)
- ✅ Auto-envío al detectar 3 cambios de ventana
- ✅ Bloqueo de copiar/pegar/cortar
- ✅ Deshabilitar menú contextual (clic derecho)
- ✅ Monitoreo de inactividad (5 minutos máximo)
- ✅ Timer con auto-envío al finalizar
- ✅ Logs detallados de comportamiento (visibilityWarnings, submissionReason)
- ✅ Acceso permitido a documentación interna del curso
- ✅ Pantalla de bloqueo al alcanzar límite de advertencias

---

## 🛠️ Stack de Desarrollo

### Frontend
```
- Framework: Next.js 14+ (App Router)
- Estilos: Tailwind CSS
- Renderizado MD: react-markdown + gray-matter
- Gestión de Estado: React Context API
- Deploy: Vercel
```

### Backend (BaaS)
```
- Plataforma: Firebase (Google)
  ├── Authentication (Google OAuth + Email/Password)
  ├── Firestore (Base de datos NoSQL)
  ├── Functions (Lógica serverless - Node.js)
  └── Hosting (Assets estáticos)
```

### APIs Externas
```
- IA: Gemini API / OpenAI API (Generación de preguntas)
- Email: Resend (Envío de feedback)
```

### Modelo de Datos (Firestore)
```javascript
Collections:
├── users/              // Profesores
├── courses/            // Cursos/Materias
│   └── sessions[]      // Sesiones con documentación
├── exams/              // Configuración de exámenes
│   ├── title           // Título del examen
│   ├── courseId        // Referencia al curso
│   ├── profesorId      // ID del profesor
│   ├── accessCode      // Código de 8 caracteres
│   ├── questionCount   // Cantidad de preguntas
│   ├── timeLimit       // Tiempo en minutos
│   ├── tolerance       // Tolerancia de advertencias (deprecated)
│   ├── generateWithAI  // Boolean para generación IA
│   ├── status          // draft | active | closed
│   └── questions[]     // Array de preguntas generadas
│       ├── id          // UUID de pregunta
│       ├── question    // Texto de la pregunta
│       ├── options[]   // Opciones de respuesta
│       ├── correctAnswer // Índice de respuesta correcta
│       ├── explanation // Explicación de la respuesta
│       └── difficulty  // easy | medium | hard
├── examAttempts/       // Intentos de estudiantes
│   ├── examId          // Referencia al examen
│   ├── studentEmail    // Email del estudiante
│   ├── studentName     // Nombre completo
│   ├── answers{}       // Objeto con respuestas {questionId: optionIndex}
│   ├── score           // Calificación sobre 5.0
│   ├── status          // in-progress | submitted
│   ├── autoSubmitted   // Boolean si fue auto-enviado
│   ├── submissionReason// manual | timeout | inactivity | visibility_violations
│   ├── visibilityWarnings // Cantidad de cambios de ventana detectados
│   ├── feedback        // Retroalimentación generada por IA
│   ├── createdAt       // Timestamp de inicio
│   └── submittedAt     // Timestamp de envío
├── githubAssignments/  // Tareas de GitHub
└── githubSubmissions/  // Entregas de repos
```

---

## ⚙️ Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ y npm/pnpm
- Cuenta de Firebase (plan Blaze recomendado)
- API key de Gemini o OpenAI
- Cuenta de Resend (para emails)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jaimezapata/z-suit.git
cd z-suit
```

### 2. Instalar Dependencias
```bash
npm install
# o
pnpm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# IA (Gemini o OpenAI)
GEMINI_API_KEY=your_gemini_key
# o
OPENAI_API_KEY=your_openai_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
```

### 4. Configurar Firebase

#### a) Crear proyecto en Firebase Console
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto
3. Habilitar Authentication (Google + Email/Password)
4. Crear base de datos Firestore

#### b) Reglas de Seguridad de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo profesores autenticados pueden crear cursos
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Estudiantes pueden crear intentos de examen
    match /examAttempts/{attemptId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
    
    // Entregas de GitHub
    match /githubSubmissions/{submissionId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
  }
}
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 6. Deploy en Producción

#### Vercel (Frontend)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Añadir variables de entorno en Vercel Dashboard
```

#### Firebase Functions (Backend)
```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Deploy functions
firebase deploy --only functions
```

---

## 🎨 Identidad Visual

### Sistema de Temas Monocromáticos Dinámicos

**Concepto:** Cada día, el profesor puede seleccionar un **color base** y la aplicación se renderiza completamente en ese esquema monocromático, manteniendo legibilidad y accesibilidad.

#### Paleta Dinámica Generada
A partir de un **color base** seleccionado (ej. `#00FF41`), el sistema genera automáticamente:

```css
/* Generación automática basada en el color del día */
--color-base: <COLOR_SELECCIONADO>           /* Color elegido por el profesor */

/* Escalas de grises monocromáticas (HSL manipulation) */
--bg-darkest: hsl(from var(--color-base) h 15% 5%)      /* Fondo principal */
--bg-dark: hsl(from var(--color-base) h 12% 8%)         /* Fondo secundario */
--bg-medium: hsl(from var(--color-base) h 10% 12%)      /* Cards, modales */

/* Acentos en saturación completa */
--accent-primary: hsl(from var(--color-base) h 100% 50%)    /* Botones, links */
--accent-secondary: hsl(from var(--color-base) h 80% 45%)   /* Hover states */
--accent-muted: hsl(from var(--color-base) h 40% 35%)       /* Borders, dividers */

/* Texto con contraste WCAG AAA */
--text-primary: hsl(from var(--color-base) h 5% 95%)    /* Texto principal */
--text-secondary: hsl(from var(--color-base) h 8% 70%)  /* Texto secundario */
--text-tertiary: hsl(from var(--color-base) h 10% 50%)  /* Texto deshabilitado */
```

#### Ejemplos de Temas Diarios

| Día | Color Base | Resultado Visual |
|-----|------------|------------------|
| **Lunes** | `#00FF41` (Verde Matrix) | Fondo negro-verdoso, acentos verde neón |
| **Martes** | `#0099FF` (Azul Cibernético) | Fondo negro-azulado, acentos azul brillante |
| **Miércoles** | `#FF0099` (Magenta) | Fondo negro-magenta, acentos fucsia |
| **Jueves** | `#FFD700` (Oro) | Fondo negro-dorado, acentos amarillo brillante |
| **Viernes** | `#FF4500` (Naranja) | Fondo negro-naranja, acentos naranja neón |

#### Garantías de Accesibilidad
- **Contraste mínimo:** 7:1 (WCAG AAA) entre texto y fondo
- **Escala perceptual:** Luminancia ajustada con algoritmo APCA
- **Daltonismo:** Validación con simuladores (Deuteranopia, Protanopia)
- **Modo de alto contraste:** Opción para aumentar saturación en casos extremos

#### Selector de Color Diario (UI)
```javascript
// Dashboard del profesor
<ThemeSelector 
  defaultColor="#00FF41"
  presets={['#00FF41', '#0099FF', '#FF0099', '#FFD700', '#FF4500']}
  allowCustom={true}
  persistenceKey="daily-theme"
/>
```

### Tipografía
- **Código/Terminal:** `Fira Code`, `JetBrains Mono`, `monospace`
- **UI/Texto:** `Inter`, `system-ui`, `sans-serif`

### Logo Concept
```
> Z-SUIT_
```
Estética de terminal con cursor parpadeante (color adaptado al tema del día).

---

## 📁 Estructura del Proyecto

```
z-suit/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── dashboard/         # Dashboard profesor
│   │   │   ├── courses/       # Gestión de cursos
│   │   │   └── exams/         # Gestión de exámenes
│   │   │       ├── page.jsx   # Lista de exámenes
│   │   │       └── [examId]/
│   │   │           └── results/ # Resultados y estadísticas
│   │   ├── exams/             # Vistas de estudiante
│   │   │   ├── access/        # Acceso con código
│   │   │   └── [examId]/
│   │   │       ├── take/      # Presentación del examen
│   │   │       └── submitted/ # Confirmación de envío
│   │   └── api/               # API routes
│   │       ├── generate-questions/ # Generar preguntas con IA
│   │       └── generate-feedback/  # Generar retroalimentación
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (Button, Modal, Input...)
│   │   ├── courses/          # Componentes de cursos
│   │   ├── exams/            # Componentes de exámenes
│   │   │   └── ExamForm.jsx  # Formulario de creación
│   │   └── documentation/    # Renderizado de Markdown
│   ├── lib/                   # Utilidades
│   │   └── firebase/         # Config y helpers Firebase
│   │       └── firestore.js  # Funciones CRUD
│   └── context/              # React Context (Auth, etc.)
├── public/                    # Assets estáticos
├── docs/                      # Documentación del proyecto
└── README.md                  # Este archivo
```

---

## 🤝 Colaboración

### Contribuir al Proyecto

1. **Fork** el repositorio
2. Crea una rama feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad X'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un **Pull Request**

### Convenciones de Código
- **ESLint** configurado (ejecutar `npm run lint`)
- **Commits semánticos:** `Add:`, `Fix:`, `Update:`, `Remove:`
- **Componentes:** PascalCase (`ExamCard.jsx`)
- **Funciones:** camelCase (`generateAccessCode()`)
- **Archivos:** kebab-case (`exam-proctoring.js`)

### Reportar Bugs
Abre un issue en GitHub con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)

---

## 👨‍💻 Desarrollador

**Jaime Zapata**  
*Profesor de Tecnología & Full-Stack Developer*

<!-- - 🌐 **Portfolio:** [jaimezapata.dev](https://jaimezapata.dev) *(placeholder)* -->
<!-- - 💼 **LinkedIn:** [linkedin.com/in/jaimezapata](https://linkedin.com/in/jaimezapata) *(placeholder)* -->
- 🐙 **GitHub:** [@jaimezapata](https://github.com/jaimezzapata) *(placeholder)*
<!-- - 📧 **Email:** jaime.zapata@edu.co *(placeholder)* -->

### Sobre el Proyecto
Z-SUIT nace de la necesidad personal de optimizar mi flujo de trabajo como profesor de tecnología. Después de años creando exámenes manualmente y gestionando entregas en múltiples plataformas, decidí construir una solución que centralizara todo en un solo lugar.

**Motivación:** *"Si puedo automatizar algo que hago más de 3 veces, lo automatizo. Este proyecto es exactamente eso."*

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver archivo `LICENSE` para más detalles.

---

## 🗺️ Roadmap Post-MVP

### Completado ✅
- ✅ Sistema completo de autenticación
- ✅ Gestión de cursos y sesiones
- ✅ Editor de documentación Markdown
- ✅ Generación de documentación con IA (Gemini)
- ✅ Sistema de exámenes con códigos de acceso
- ✅ Generación automática de preguntas con IA
- ✅ Interfaz de presentación de exámenes
- ✅ Sistema antifraude completo (copy/paste, visibility, inactivity)
- ✅ Auto-envío con pantalla de bloqueo
- ✅ Calificación automática sobre 5.0
- ✅ Generación de retroalimentación con IA
- ✅ Dashboard de resultados con estadísticas

### v1.1 (Q1 2026)
- [ ] **Envío de feedback por email** (Resend integration) 🎯 *Siguiente*
- [ ] **Sistema de temas monocromáticos dinámicos** ⭐
- [ ] Selector de color diario con persistencia
- [ ] Exportar exámenes a PDF
- [ ] Gráficos de analytics (rendimiento por curso)
- [ ] Modo offline para documentación
- [ ] Soporte para imágenes en Markdown
- [ ] Edición manual de preguntas generadas
- [ ] Banco de preguntas reutilizable

### v1.2 (Q2 2026)
- [ ] Presets de colores favoritos (guardar paletas)
- [ ] Animaciones de transición entre temas
- [ ] Sistema de rúbricas personalizables
- [ ] Integración con Google Classroom
- [ ] Comentarios inline en código (GitHub Grader)
- [ ] Notificaciones push
- [ ] Historial de exámenes por estudiante

### v2.0 (Q3 2026)
- [ ] Evaluación de código en tiempo real (Code Runner)
- [ ] Proctoring con cámara web (opcional)
- [ ] Sistema de badges/gamificación
- [ ] API pública para integraciones
- [ ] Modo fullscreen obligatorio
- [ ] Detección de múltiples monitores

---

## 🙏 Agradecimientos

- **Firebase Team** - Por una plataforma BaaS increíble
- **Vercel** - Por el mejor DX en deploy de Next.js
- **OpenAI/Google** - Por democratizar el acceso a IA
- **Comunidad de Next.js** - Por recursos y documentación excepcionales

---

## 📞 Soporte

¿Necesitas ayuda?
1. Revisa la [documentación completa](./docs/DOCUMENTACION.md)
2. Consulta el [cronograma del proyecto](./PROJECT_ROADMAP.md)
3. Abre un issue en GitHub
4. Contacta directamente al desarrollador

---

<div align="center">

**Hecho con ☕ y muchas horas de código por Jaime Zapata**

`> Z-SUIT_ 2025`

</div>
