# Z-SUIT - Cronograma y Tareas del Proyecto

**Versión:** 1.1  
**Fecha de Inicio:** 17 de noviembre de 2025  
**Fecha Actual:** 18 de noviembre de 2025  
**Deadline MVP:** 26 de enero de 2026  
**Tiempo disponible:** 10 semanas (69 días restantes)

---

## 📅 Cronograma General

### **✅ Fase 1: Configuración y Fundamentos (Semana 1-2)** - COMPLETADA

_17 Nov - 1 Dic 2025_

#### Semana 1 (17-24 Nov) - ✅ COMPLETADA (100%)

- [x] Configurar Firebase en el proyecto Next.js
- [x] Implementar Firebase Auth (Google + Email/Password)
- [x] Diseñar schema de Firestore y crear reglas de seguridad
- [x] Configurar variables de entorno (.env.local)
- [x] Crear sistema de diseño base (Tailwind config con colores Z-SUIT)
- [x] Implementar layout principal con Dark Mode (`#0D1117`)
- [x] Sistema de temas dinámicos (4 esquemas × 5 intensidades con persistencia)
- [x] Crear página de login para profesores
- [x] Implementar protección de rutas (middleware)
- [x] Crear dashboard principal del profesor
- [x] Crear contexto de autenticación global
- [x] Foto de perfil de Google en dashboard
- [x] Reemplazo de emojis por iconos (Lucide React)

#### Semana 2 (25 Nov - 1 Dic) - 🚧 EN PROGRESO (70%)

- [x] Implementar CRUD completo de Cursos
  - [x] Crear curso con tipo (Regular: 18 sesiones / Empresarial: 7 sesiones)
  - [x] Listar cursos con diseño horizontal expandido
  - [x] Editar/Eliminar cursos
  - [x] Sistema de códigos de acceso únicos
  - [x] Gestión de visibilidad (Público/Privado)
  - [x] Slugs automáticos para URLs amigables
- [x] Diseño de tarjetas de curso con estadísticas visuales
- [x] Panel de administración superadmin
  - [x] Eliminación masiva de cursos/usuarios/exámenes
  - [x] Protección de cuentas superadmin
- [ ] Editor de Sesiones con IA
  - [x] Vista de gestión de curso por sesiones
  - [x] Formulario de edición por sesión
  - [x] Integración con Gemini API (gemini-2.0-flash-lite)
  - [x] Generación de documentación IA
  - [x] Preview y edición de Markdown (react-markdown + remark-gfm)
  - [x] Sistema de sincronización con carpeta /docs
  - [x] Import/Export de archivos .md
  - [x] Gestión de archivos locales (Load/Save)
  - [ ] Optimizaciones finales del editor

---

### **Fase 2: Módulo de Documentación (Semana 3-4)** - 🚧 INICIADA

_2 Dic - 15 Dic 2025_

#### Semana 3 (2-8 Dic)

- [x] Integrar `react-markdown` con remark-gfm
- [x] Implementar preview en tiempo real del Markdown
- [x] Diseñar sistema de estilos para docs (@tailwindcss/typography)
- [x] CRUD de documentación en Firestore (dentro de sessions)
- [x] Asociar documentación a sesiones de cursos
- [ ] Vista pública de documentación (en progreso)
  - [x] Ruta `/curso-publico/[slug]` creada
  - [ ] Navegación entre sesiones
  - [ ] Diseño final para estudiantes
- [ ] Editor de Markdown mejorado
  - [ ] Toolbar con formato
  - [ ] Atajos de teclado
  - [ ] Inserción de imágenes

#### Semana 4 (9-15 Dic)

- [ ] Completar vista pública de documentación
- [ ] Implementar navegación entre documentos del curso
- [ ] Añadir búsqueda dentro de la documentación
- [ ] Optimizar renderizado de MD (syntax highlighting con rehype-highlight)
- [ ] Sistema de índice/tabla de contenidos
- [ ] Testing del módulo de documentación
- [ ] Ajustes de UX/UI basados en pruebas

---

### **Fase 3: Módulo de Evaluación IA (Semana 5-7)**

_16 Dic 2025 - 5 Ene 2026_

#### Semana 5 (16-22 Dic)

- [ ] Configurar Firebase Functions
- [ ] Crear función serverless para generar preguntas desde docs
- [ ] Implementar parseo de documentación para contexto IA
- [ ] Crear interfaz de revisión de preguntas sugeridas
- [ ] Implementar sistema de aprobación/edición/descarte
- [ ] Guardar banco de preguntas en Firestore

#### Semana 6 (23-29 Dic) 🎄 _Semana Festiva - Trabajo Reducido_

- [ ] Crear configurador de exámenes (UI)
- [ ] Implementar generación de `accessCode` único para exámenes
- [ ] Guardar configuración en Firestore (`exams/`)
- [ ] Crear página de acceso para estudiantes (código + email)
- [ ] Implementar timer del examen
- [ ] Diseñar UI del examen (pregunta por pregunta)

#### Semana 7 (30 Dic - 5 Ene) 🎉 _Año Nuevo - Trabajo Reducido_

- [ ] **[CRÍTICO]** Implementar modo Fullscreen obligatorio
- [ ] **[CRÍTICO]** Sistema de detección `visibilitychange`
- [ ] **[CRÍTICO]** Detección de eventos de clipboard
- [ ] Implementar logs de proctoring en `examAttempts/`
- [ ] Crear sidebar de docs internas (permitido durante examen)
- [ ] Implementar lógica de margen de tolerancia
- [ ] Sistema de penalización por infracciones

---

### **Fase 4: Módulo GitHub Grader (Semana 8)**

_6 Ene - 12 Ene 2026_

#### Semana 8 (6-12 Ene)

- [ ] Crear CRUD de "Tareas de GitHub" (UI + Firestore)
- [ ] Implementar formulario de entrega para estudiantes
- [ ] Validar URLs de GitHub en el frontend
- [ ] Crear dashboard de entregas por tarea
- [ ] Implementar campos `grade` y `feedback`
- [ ] Crear función Firebase para envío de emails (Resend)
- [ ] Testing de flujo completo de entrega/calificación

---

### **Fase 5: Integración y Pulido (Semana 9)**

_13 Ene - 19 Ene 2026_

#### Semana 9 (13-19 Ene)

- [ ] Integrar todos los módulos en el dashboard principal
- [ ] Crear sistema de navegación entre módulos
- [ ] Implementar notificaciones/feedback visual mejoradas
- [ ] Añadir estados de carga y manejo de errores
- [ ] Optimizar queries de Firestore (indices)
- [ ] Implementar analytics básico (opcional)
- [ ] Testing de integración completo
- [ ] Ajustes de rendimiento y optimización de bundle

---

### **Fase 6: Testing, Deploy y Lanzamiento (Semana 10)**

_20 Ene - 26 Ene 2026_

#### Semana 10 (20-26 Ene) - **DEADLINE**

- [ ] Testing exhaustivo de todos los módulos
- [ ] Testing de proctoring en diferentes navegadores
- [ ] Configurar reglas de seguridad de Firestore (producción)
- [ ] Configurar variables de entorno en Vercel
- [ ] Deploy de Firebase Functions
- [ ] Deploy de Next.js en Vercel
- [ ] Testing en producción
- [ ] Crear documentación de uso básico
- [ ] Preparar demo para primera clase
- [ ] **🚀 LANZAMIENTO MVP - 26 Enero 2026**

---

## 🎯 Hitos Críticos

| Fecha      | Hito                            | Estado | Descripción                                 |
| ---------- | ------------------------------- | ------ | ------------------------------------------- |
| **1 Dic**  | Auth + Cursos Funcionando       | ✅ ✓   | Sistema de login y gestión básica de cursos |
| **15 Dic** | Módulo Docs Completo            | 🚧 70% | Editor MD + Vista estudiante funcional      |
| **5 Ene**  | Sistema de Proctoring Operativo | ⏳     | Anti-cheat implementado y probado           |
| **12 Ene** | GitHub Grader Completo          | ⏳     | Flujo completo de entrega/calificación      |
| **19 Ene** | Integración Finalizada          | ⏳     | Todos los módulos trabajando juntos         |
| **26 Ene** | **LANZAMIENTO MVP**             | ⏳     | Producto en producción listo para usar      |

---

## 📋 Tareas por Módulo (Checklist Detallado)

### **A. Infraestructura Base** - ✅ COMPLETADO (100%)

- [x] Inicializar Firebase en Next.js
- [x] Configurar Firebase Auth (Google + Email/Password)
- [x] Crear collections en Firestore
- [x] Configurar Firebase Security Rules
- [x] Setup de variables de entorno
- [x] Configurar Tailwind con tema Z-SUIT
- [x] Crear componentes base (Button, Input, Card, Modal, etc.)
- [x] Implementar layout con navegación
- [x] Sistema de protección de rutas
- [x] Sistema de temas dinámicos con persistencia

### **B. Módulo de Autenticación** - ✅ COMPLETADO (100%)

- [x] Página de login (`/login`)
- [x] Lógica de login con Google
- [x] Lógica de login con Email/Password
- [x] Contexto de autenticación React
- [x] Middleware de Next.js para rutas protegidas
- [x] Página de dashboard profesor (`/dashboard`)
- [x] Logout functionality
- [x] Foto de perfil de Google

### **C. Módulo de Cursos** - ✅ COMPLETADO (100%)

- [x] UI para crear curso (modal con preview)
- [x] Tipo de curso: Regular (18 sesiones) / Empresarial (7 sesiones)
- [x] UI para listar cursos (diseño horizontal con tarjetas)
- [x] Estadísticas visuales (progreso, sesiones, badges)
- [x] UI para editar curso
- [x] UI para eliminar curso (con confirmación)
- [x] Firestore CRUD operations
- [x] Asociar cursos al `profesorId`
- [x] Validaciones de formulario
- [x] Sistema de códigos de acceso únicos
- [x] Gestión de visibilidad (Público/Privado)
- [x] Generación automática de slugs
- [x] Vista de gestión de sesiones por curso
- [x] Modal adaptable (fullHeight prop)

### **D. Módulo de Documentación** - 🚧 EN PROGRESO (70%)

- [x] Editor de Markdown integrado en sesiones
- [x] Integrar `react-markdown` + `remark-gfm`
- [x] Preview en tiempo real (toggle Preview/Edit)
- [x] Guardar en Firestore (`courses/[id]/sessions[]`)
- [x] Integración con Gemini API
- [x] Generación automática de documentación IA
- [x] Sistema de sincronización con carpeta `/docs`
  - [x] API `/api/sync-docs` (POST/GET)
  - [x] Búsqueda flexible por courseId/code/slug
  - [x] Parseo de frontmatter YAML
- [x] Import/Export de archivos .md
- [x] API `/api/save-markdown` para gestión local
- [x] Estilos con @tailwindcss/typography
- [ ] Vista pública completamente funcional
  - [x] Ruta `/curso-publico/[slug]` creada
  - [ ] Navegación mejorada entre sesiones
  - [ ] Índice de contenidos
- [ ] Búsqueda dentro de la documentación
- [ ] Syntax highlighting (rehype-highlight)

### **E. Módulo de Evaluación IA** - ⏳ PENDIENTE

#### E1. Generación de Preguntas

- [ ] Firebase Function: `generateQuestions`
- [ ] Integrar Gemini/OpenAI API para generación de preguntas
- [ ] Parsear documentación como contexto
- [ ] Generar JSON de preguntas
- [ ] Guardar en `questionBanks/` con status "pending"
- [ ] UI para revisar preguntas sugeridas
- [ ] Aprobar/Editar/Descartar preguntas
- [ ] Filtrar preguntas por `courseId` y `status`

#### E2. Configuración de Exámenes

- [ ] UI para crear examen
- [ ] Generar `accessCode` único (6 caracteres)
- [ ] Configurar: tiempo, número de preguntas, tolerancia fraude
- [ ] Seleccionar preguntas del banco aprobado
- [ ] Guardar en `exams/`

#### E3. Acceso y Presentación (Estudiante)

- [ ] Página de acceso (`/exam/access`)
- [ ] Validar `accessCode` + `email`
- [ ] Crear registro en `examAttempts/`
- [ ] Iniciar modo Fullscreen
- [ ] UI de examen (pregunta por pregunta)
- [ ] Timer countdown
- [ ] Navegación entre preguntas
- [ ] Marcar/desmarcar respuestas
- [ ] Botón "Enviar Examen"

#### E4. Sistema de Proctoring (Anti-Cheat)

- [ ] Detectar salida de Fullscreen
- [ ] Detectar `visibilitychange` (cambio de pestaña/ventana)
- [ ] Detectar eventos de clipboard (`copy`, `paste`)
- [ ] Registrar eventos en array `proctoringLogs[]`
- [ ] Implementar lógica de margen de tolerancia
- [ ] Sidebar de docs internas (sin penalización)
- [ ] Calcular penalizaciones en score final
- [ ] Advertencias visuales en tiempo real
- [ ] Modal de confirmación antes de enviar

#### E5. Resultados y Dashboard

- [ ] Calcular score automáticamente
- [ ] Guardar respuestas en `examAttempts/`
- [ ] Dashboard de resultados (profesor)
- [ ] Ver logs de proctoring por estudiante
- [ ] Exportar resultados (CSV opcional)

### **F. Módulo GitHub Grader** - ⏳ PENDIENTE

#### F1. Tareas de GitHub (Profesor)

- [ ] UI para crear tarea GitHub
- [ ] CRUD de `githubAssignments/`
- [ ] Asociar a `courseId`
- [ ] Campos: título, instrucciones, fecha límite
- [ ] Lista de tareas por curso

#### F2. Entregas (Estudiante)

- [ ] Página de entrega (`/assignments/[id]/submit`)
- [ ] Formulario: email + repo URL
- [ ] Validar formato de URL de GitHub
- [ ] Guardar en `githubSubmissions/`
- [ ] Confirmación de entrega

#### F3. Calificación (Profesor)

- [ ] Dashboard de entregas (`/assignments/[id]/submissions`)
- [ ] Listar todas las entregas
- [ ] Abrir repo en nueva pestaña
- [ ] Campos editables: `grade` y `feedback`
- [ ] Guardar calificación en Firestore
- [ ] Botón "Enviar Feedback"

#### F4. Notificaciones

- [ ] Firebase Function: `sendGradeFeedback`
- [ ] Integrar Resend API
- [ ] Template de email profesional
- [ ] Enviar a `studentEmail`
- [ ] Actualizar status a "graded"
- [ ] Confirmación visual en UI

### **G. Funcionalidades Adicionales Implementadas** ✅

- [x] Panel de Superadmin (`/dashboard/admin`)
  - [x] Estadísticas del sistema (cursos, usuarios, sesiones, exámenes)
  - [x] Eliminación masiva de datos con confirmación
  - [x] Protección contra eliminación de superadmins
  - [x] Sistema de roles (superadmin/profesor)
- [x] Sistema de archivos locales (carpeta `/docs`)
  - [x] Estructura flexible: `/docs/[courseId|code|slug]/XX-titulo.md`
  - [x] Sincronización bidireccional con Firestore
  - [x] Import/Export individual de sesiones
  - [x] Búsqueda flexible por múltiples identificadores

### **H. Integración y UX** - 🚧 EN PROGRESO

- [x] Dashboard unificado con todos los módulos
- [x] Sistema de navegación intuitivo (DashboardNav)
- [x] Breadcrumbs de navegación
- [x] Estados de carga (spinners, skeletons)
- [x] Manejo de errores global
- [x] Notificaciones toast (sonner)
- [x] Confirmaciones de acciones destructivas
- [ ] Responsive design completo (mobile-friendly)
- [ ] Accesibilidad básica (ARIA labels)
- [x] Sistema de temas con persistencia

### **I. Testing y QA** - ⏳ PENDIENTE

- [ ] Testing de autenticación
- [ ] Testing de CRUD de cursos
- [ ] Testing de editor Markdown
- [ ] Testing de generación IA
- [ ] Testing exhaustivo de proctoring
- [ ] Testing de calificación GitHub
- [ ] Testing cross-browser (Chrome, Firefox, Safari)
- [ ] Testing en móvil (responsive)
- [ ] Testing de Firebase Functions
- [ ] Testing de envío de emails

### **J. Deployment y Producción** - ⏳ PENDIENTE

- [ ] Configurar Firebase project (producción)
- [ ] Configurar reglas de seguridad Firestore
- [ ] Deploy Firebase Functions
- [ ] Configurar secrets en Firebase
- [ ] Configurar project en Vercel
- [ ] Añadir variables de entorno en Vercel
- [ ] Deploy Next.js en Vercel
- [ ] Configurar dominio (opcional)
- [ ] Testing en producción
- [ ] Monitoring básico

---

## 🔥 Prioridades por Riesgo

### **Alta Prioridad (Riesgo Alto)**

1. **Sistema de Proctoring** - Tecnología compleja, requiere testing extensivo
2. **Integración IA** - ✅ Parcialmente implementada (generación docs), falta generación de preguntas
3. **Firebase Functions** - Requiere despliegue separado, debugging complejo

### **Prioridad Media (Riesgo Medio)**

4. **Editor Markdown** - ✅ COMPLETADO - UX crítica implementada
5. **Autenticación** - ✅ COMPLETADO - Funcionando con Google y Email/Password
6. **GitHub Grader** - Relativamente simple pero importante
7. **Vista Pública de Documentación** - Funcionalidad core para estudiantes

### **Prioridad Baja (Riesgo Bajo)**

8. **UI/Estilos** - ✅ Mayormente completado - Sistema de temas implementado
9. **Notificaciones Email** - Nice to have, puede simplificarse
10. **Analytics** - Opcional para MVP

---

## 📊 Métricas de Éxito del MVP

- [x] Un profesor puede crear un curso completo en < 5 minutos
- [x] La IA genera documentación relevante en < 30 segundos (Gemini 2.0)
- [ ] El sistema de proctoring detecta > 95% de intentos de fraude
- [ ] Zero falsas alarmas críticas de proctoring
- [ ] Un estudiante puede completar un examen sin fricción técnica
- [ ] El dashboard de GitHub muestra todas las entregas en una vista
- [ ] Los emails de feedback se envían en < 5 segundos
- [x] La aplicación carga en < 2 segundos (LCP)
- [ ] Zero errores críticos en producción durante la primera semana

---

## 🛠️ Stack Técnico - Estado Actual

### Frontend ✅

- **Framework:** Next.js 16.0.3 (App Router) ✅
- **Estilos:** Tailwind CSS 3.4.17 ✅
- **Markdown:** react-markdown 10.1.0 + remark-gfm 4.0.1 ✅
- **Tipografía:** @tailwindcss/typography 0.5.16 ✅
- **Estado:** React Context API (AuthContext) ✅
- **Iconos:** Lucide React ✅
- **Notificaciones:** Sonner ✅

### Backend ✅

- **BaaS:** Firebase 11.1.0 ✅
  - Auth (Google, Email/Password) ✅
  - Firestore (NoSQL) ✅
  - Functions (Node.js) - Pendiente
  - Storage - Opcional

### APIs Externas

- **IA:** Google Gemini API (gemini-2.0-flash-lite) ✅
- **Email:** Resend

### Deploy

- **Frontend:** Vercel
- **Backend:** Firebase Hosting (funciones)

---

## 📝 Notas Importantes

### Consideraciones de Tiempo

- **Semana de Navidad (23-29 Dic):** Productividad reducida ~50%
- **Año Nuevo (30 Dic - 1 Ene):** Productividad reducida ~50%
- **Buffer de 6 días** antes del deadline para imprevistos

### Dependencias Críticas

1. Obtener API keys (Gemini/OpenAI, Resend) - **Semana 1**
2. Configurar proyecto Firebase - **Semana 1**
3. Configurar cuenta Vercel - **Semana 1**

### Riesgos Identificados

1. **Compatibilidad Fullscreen API:** Safari tiene limitaciones
2. **Latencia IA:** Puede tomar > 30s en docs grandes
3. **Costos API:** Monitorear uso de tokens de IA
4. **Firestore Limits:** Free tier = 50k lecturas/día

---

## 🎓 Entregables del MVP

1. **Aplicación Web Funcional** (z-suit.vercel.app)
2. **Panel de Administración** (Profesor)
3. **Portal de Estudiante** (Exámenes + Entregas)
4. **Documentación Básica** (README + guía rápida)
5. **Video Demo** (5 minutos) - Opcional

---

**Última actualización:** 17 de noviembre de 2025  
**Siguiente revisión:** 1 de diciembre de 2025 (fin de Fase 1)
