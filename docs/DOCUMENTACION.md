# Documento de Definición de Proyecto: Z-SUIT

**Versión:** 2.4 (MVP + Proctoring Restaurado)
**Fecha:** 17 de noviembre de 2025
**Stakeholder Principal:** Jaime Zapata (Profesor/Desarrollador)
**Deadline MVP:** 26 de enero de 2026

---

## 1. Resumen Ejecutivo

**Z-SUIT** es una plataforma educativa enfocada, diseñada para la productividad del profesor de tecnología. El MVP (v1.0) se centra en resolver tres tareas clave del flujo de trabajo docente:

1.  **Gestión de Documentación:** Un sistema para crear y alojar material de estudio (MD -> HTML).
2.  **Evaluación con IA Segura:** Un generador de exámenes (preguntas de opción múltiple) basado en IA, presentado en un **entorno seguro con proctoring (anti-fraude)**.
3.  **Calificación de Repositorios:** Un dashboard centralizado para recibir y calificar entregas de repositorios de GitHub.

La plataforma prioriza la velocidad de desarrollo y la simplicidad de la arquitectura, utilizando un stack Next.js + Firebase.

## 2. Identidad de Marca (Brand Identity)

* **Nombre:** **Z-SUIT**
* **Logo Concept:** `> Z-SUIT_` (Estética de terminal).
* **Estilo Visual:** Dark Mode Only (`#0D1117`), Acentos Verdes (`#00FF41`) y Rojos (`#FF0033`).

## 3. Propósito y Objetivos (MVP)

### 3.1. Propósito
Optimizar drásticamente el tiempo y la carga cognitiva del profesor, automatizando la creación de exámenes (garantizando su integridad) y centralizando la calificación de proyectos.

### 3.2. Objetivos (Deadline: 26 Enero 2026)
* **O1:** Lanzar un MVP funcional con los 3 módulos principales (Docs, IA Exams Seguros, GitHub Grader).
* **O2:** Implementar un sistema de proctoring por capas (Fullscreen, Focus, Clipboard) para el módulo de Evaluación IA.
* **O3:** Centralizar todas las entregas de repositorios de GitHub en un solo dashboard por curso.

## 4. Alcance del Proyecto (Scope v2.4)

### 4.1. Módulo de Administración (Profesor)
* **Autenticación:** El profesor (Admin) inicia sesión (Firebase Auth con Google o Email/Pass).
* **Gestión de Cursos:** Crear, editar y eliminar "Cursos" o "Materias" (ej. "React Avanzado").

### 4.2. Módulo de Documentación (Core)
* **Editor (Admin):** Crear/editar documentación (Markdown + Frontmatter) asociada a un `courseId`.
* **Renderizado (Estudiante):** Los estudiantes ven esto como una página web estilizada.

### 4.3. Módulo de Evaluación IA (con Proctoring)
* **Generación (IA):** Basado en un módulo de documentación, la IA (vía Firebase Function) genera un banco de preguntas (JSON) asociado al `courseId`.
* **Curaduría (Admin):** El profesor debe aprobar/editar/descartar las preguntas sugeridas por la IA.
* **Configuración de Examen:** El admin genera un `accessCode` para un examen (Nro. preguntas, tiempo límite, **margen de tolerancia de fraude**).
* **Acceso (Estudiante):** El estudiante usa el `accessCode` + `email` para presentar el examen.
* **Entorno de Examen Seguro (Anti-Cheat):** [CRÍTICO]
    * **Modo Fullscreen:** Al iniciar, se solicita `requestFullscreen()`. Salir del modo *fullscreen* (sin enviar) se considera una infracción grave.
    * **Proctoring por Capas:** Detección de `visibilitychange` (pérdida de foco) y eventos del portapapeles (`oncopy`/`onpaste`).
    * **Acceso a Docs Internas:** El estudiante puede abrir una barra lateral para consultar la documentación *interna* del curso sin ser penalizado.
    * **Margen de Error:** Configurable (ej. "Permitir 3 salidas de foco < 5s (accidentes); infracciones > 5s se penalizan").

### 4.4. Módulo de Calificación de Repositorios (GitHub)
* **Creación (Admin):** El profesor crea una "Tarea de GitHub" (título, instrucciones) asociada a un `courseId`.
* **Entrega (Estudiante):** El estudiante accede (formulario simple) y envía `email` y `repo_url`.
* **Dashboard (Admin):** El profesor ve un dashboard de todas las entregas (`githubSubmissions`) para esa tarea.
* **Calificación (Admin):** El profesor rellena los campos `grade` y `feedback`.
* **Notificación:** Un botón "Enviar Feedback" dispara un email (vía Firebase Function) al estudiante.

## 5. Requerimientos Funcionales Clave (MVP)

* **RF-01:** Como Profesor, quiero iniciar sesión con mi cuenta de Google.
* **RF-02:** Como Profesor, quiero crear un "Curso" (ej. "React").
* **RF-03:** Como Profesor, quiero escribir documentación en Markdown asociada a mi "Curso".
* **RF-04:** Como Profesor, quiero que la IA me sugiera preguntas de examen basadas en mi documentación.
* **RF-05:** Como Estudiante, quiero acceder a un examen con un código y mi email.
* **RF-06:** Como Profesor, quiero crear una "Tarea de GitHub".
* **RF-07:** Como Estudiante, quiero enviar un link a mi repositorio de GitHub.
* **RF-08:** Como Profesor, quiero ver una lista de los repos enviados y poder ponerles `nota` y `feedback`.
* **RF-09:** Como Profesor, quiero que mi `feedback` se envíe por email al estudiante.
* **RF-10 (NUEVO - Proctoring):** Como Sistema, debo detectar `Fullscreen change`, `visibilitychange` y `clipboard events` durante un examen de IA.
* **RF-11 (NUEVO - Docs Internas):** Como Estudiante, durante un examen de IA, quiero poder consultar la documentación interna del curso sin ser penalizado.

## 6. Stack de Desarrollo (Realista para el Deadline)

### 6.1. Front-end
* **Framework:** **Next.js** (Desplegado en **Vercel**).
* **Estilos:** **Tailwind CSS**.
* **Renderizado MD:** `react-markdown` + `gray-matter`.

### 6.2. Back-end (BaaS)
* **Plataforma:** **Firebase (Google)**.
    * **Autenticación:** Firebase Auth (para el Profesor).
    * **Base de Datos:** **Firestore (NoSQL)**.
    * **Lógica Segura:** **Firebase Functions** (para llamadas a IA y envío de emails).

### 6.3. Modelo de Datos Firestore (Propuesto)

```javascript
// Colección de Profesores (Admin)
users/
  {profesor_uid}/
    email: "jaime.zapata@..."

// Cursos o Materias (Entidad Principal)
courses/
  {course_id}/
    profesorId: "{profesor_uid}"
    name: "React Avanzado"

// Documentación de cada curso
documentation/
  {doc_id}/
    courseId: "{course_id}"
    contentMd: "# Markdown..."
    metadata: { ... }

// Banco de preguntas curado
questionBanks/
  {question_id}/
    courseId: "{course_id}"
    question: "¿Qué es un Hook?"
    options: [...]
    status: "approved"

// Configuración de un examen específico
exams/
  {exam_id}/
    courseId: "{course_id}"
    accessCode: "B4T9X"
    timeLimit: 60
    fraudTolerance: 3 // <-- Anti-Cheat Config

// Entregas de los estudiantes (Examen IA)
examAttempts/
  {attempt_id}/
    examId: "{exam_id}"
    studentEmail: "estudiante@..."
    score: 90
    proctoringLogs: [ // <-- Anti-Cheat Logs
        { "event": "focus_lost", "timestamp": 1731890000 }
    ]
    answers: [...]

// Definición de una Tarea de GitHub
githubAssignments/
  {assignment_id}/
    courseId: "{course_id}"
    title: "Entrega Final - E-commerce"
    instructions: "Hacer deploy..."

// Entregas de los estudiantes (GitHub)
githubSubmissions/
  {submission_id}/
    assignmentId: "{assignment_id}"
    studentEmail: "otro.estudiante@..."
    repo_url: "[https://github.com/](https://github.com/)..."
    grade: 95
    feedback: "Excelente trabajo en los reducers."
    status: "graded" | "pending"
```

### 6.4. Servicios de Terceros
* IA: Gemini API o OpenAI API (Llamada desde Firebase Functions).

    * ***Emails: Resend (Fácil de integrar con React/Functions para el feedback).