# Z-SUIT - Cronograma y Tareas del Proyecto

**Versión:** 1.0  
**Fecha de Inicio:** 17 de noviembre de 2025  
**Deadline MVP:** 26 de enero de 2026  
**Tiempo disponible:** 10 semanas (70 días)

---

## 📅 Cronograma General

### **✅ Fase 1: Configuración y Fundamentos (Semana 1-2)** - COMPLETADA

_18 Nov - 1 Dic 2025_

#### Semana 1 (18-24 Nov) - ✅ COMPLETADA

- [x] Configurar Firebase en el proyecto Next.js
- [x] Implementar Firebase Auth (Google + Email/Password)
- [x] Diseñar schema de Firestore y crear reglas de seguridad
- [x] Configurar variables de entorno (.env.local)
- [x] Crear sistema de diseño base (Tailwind config con colores Z-SUIT)
- [x] Implementar layout principal con Dark Mode (`#0D1117`)
- [x] Sistema de temas dinámicos (4 esquemas × 5 intensidades)

#### Semana 2 (25 Nov - 1 Dic) - ✅ COMPLETADA

- [x] Crear página de login para profesores
- [x] Implementar protección de rutas (middleware)
- [x] Crear dashboard principal del profesor
- [x] Crear contexto de autenticación global
- [x] Foto de perfil de Google en dashboard
- [x] Reemplazo de emojis por iconos (Lucide React)
- [ ] Implementar CRUD básico de Cursos (UI + Firestore) - **SIGUIENTE**

---

### **Fase 2: Módulo de Documentación (Semana 3-4)**

_2 Dic - 15 Dic 2025_

#### Semana 3 (2-8 Dic)

- [ ] Crear editor de Markdown con frontmatter
- [ ] Integrar `react-markdown` y `gray-matter`
- [ ] Implementar preview en tiempo real del Markdown
- [ ] Diseñar sistema de estilos para docs renderizadas
- [ ] CRUD completo de documentación en Firestore
- [ ] Asociar documentación a cursos (`courseId`)

#### Semana 4 (9-15 Dic)

- [ ] Crear vista pública de documentación para estudiantes
- [ ] Implementar navegación entre documentos del curso
- [ ] Añadir búsqueda dentro de la documentación
- [ ] Optimizar renderizado de MD (syntax highlighting)
- [ ] Testing del módulo de documentación
- [ ] Ajustes de UX/UI basados en pruebas

---

### **Fase 3: Módulo de Evaluación IA (Semana 5-7)**

_16 Dic 2025 - 5 Ene 2026_

#### Semana 5 (16-22 Dic)

- [ ] Configurar Firebase Functions
- [ ] Integrar Gemini API o OpenAI API
- [ ] Crear función serverless para generar preguntas
- [ ] Implementar parseo de documentación para contexto IA
- [ ] Crear interfaz de revisión de preguntas sugeridas
- [ ] Implementar sistema de aprobación/edición/descarte

#### Semana 6 (23-29 Dic) 🎄 _Semana Festiva - Trabajo Reducido_

- [ ] Crear configurador de exámenes (UI)
- [ ] Implementar generación de `accessCode` único
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
- [ ] Implementar notificaciones/feedback visual
- [ ] Añadir estados de carga y manejo de errores
- [ ] Optimizar queries de Firestore (indices)
- [ ] Implementar analytics básico (opcional)
- [ ] Testing de integración completo
- [ ] Ajustes de rendimiento

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

| Fecha      | Hito                            | Descripción                                 |
| ---------- | ------------------------------- | ------------------------------------------- |
| **1 Dic**  | Auth + Cursos Funcionando       | Sistema de login y gestión básica de cursos |
| **15 Dic** | Módulo Docs Completo            | Editor MD + Vista estudiante funcional      |
| **5 Ene**  | Sistema de Proctoring Operativo | Anti-cheat implementado y probado           |
| **12 Ene** | GitHub Grader Completo          | Flujo completo de entrega/calificación      |
| **19 Ene** | Integración Finalizada          | Todos los módulos trabajando juntos         |
| **26 Ene** | **LANZAMIENTO MVP**             | Producto en producción listo para usar      |

---

## 📋 Tareas por Módulo (Checklist Detallado)

### **A. Infraestructura Base**

- [ ] Inicializar Firebase en Next.js
- [ ] Configurar Firebase Auth (Google + Email/Password)
- [ ] Crear collections en Firestore
- [ ] Configurar Firebase Security Rules
- [ ] Setup de variables de entorno
- [ ] Configurar Tailwind con tema Z-SUIT
- [ ] Crear componentes base (Button, Input, Card, etc.)
- [ ] Implementar layout con navegación
- [ ] Sistema de protección de rutas

### **B. Módulo de Autenticación**

- [ ] Página de login (`/login`)
- [ ] Lógica de login con Google
- [ ] Lógica de login con Email/Password
- [ ] Contexto de autenticación React
- [ ] Middleware de Next.js para rutas protegidas
- [ ] Página de dashboard profesor (`/dashboard`)
- [ ] Logout functionality

### **C. Módulo de Cursos**

- [ ] UI para crear curso
- [ ] UI para listar cursos
- [ ] UI para editar curso
- [ ] UI para eliminar curso
- [ ] Firestore CRUD operations
- [ ] Asociar cursos al `profesorId`
- [ ] Validaciones de formulario

### **D. Módulo de Documentación**

- [ ] Editor de Markdown (`/courses/[id]/docs/new`)
- [ ] Integrar `gray-matter` para frontmatter
- [ ] Preview en tiempo real
- [ ] Guardar en Firestore (`documentation/`)
- [ ] Lista de documentos por curso
- [ ] Editar documento existente
- [ ] Eliminar documento
- [ ] Vista estudiante (`/courses/[id]/docs/[docId]`)
- [ ] Renderizado con `react-markdown`
- [ ] Estilos personalizados para MD
- [ ] Syntax highlighting (código)
- [ ] Navegación entre docs

### **E. Módulo de Evaluación IA**

#### E1. Generación de Preguntas

- [ ] Firebase Function: `generateQuestions`
- [ ] Integrar Gemini/OpenAI API
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

### **F. Módulo GitHub Grader**

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

### **G. Integración y UX**

- [ ] Dashboard unificado con todos los módulos
- [ ] Sistema de navegación intuitivo
- [ ] Breadcrumbs de navegación
- [ ] Estados de carga (spinners, skeletons)
- [ ] Manejo de errores global
- [ ] Notificaciones toast/snackbar
- [ ] Confirmaciones de acciones destructivas
- [ ] Responsive design (mobile-friendly)
- [ ] Accesibilidad básica (ARIA labels)

### **H. Testing y QA**

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

### **I. Deployment y Producción**

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
2. **Integración IA** - Dependencia externa, puede tener latencia
3. **Firebase Functions** - Requiere despliegue separado, debugging complejo

### **Prioridad Media (Riesgo Medio)**

4. **Editor Markdown** - UX crítica pero tecnología conocida
5. **Autenticación** - Bien documentado pero crítico para seguridad
6. **GitHub Grader** - Relativamente simple pero importante

### **Prioridad Baja (Riesgo Bajo)**

7. **UI/Estilos** - Iterativo, se puede ajustar continuamente
8. **Notificaciones Email** - Nice to have, puede simplificarse
9. **Analytics** - Opcional para MVP

---

## 📊 Métricas de Éxito del MVP

- [ ] Un profesor puede crear un curso completo en < 5 minutos
- [ ] La IA genera 20+ preguntas relevantes en < 30 segundos
- [ ] El sistema de proctoring detecta > 95% de intentos de fraude
- [ ] Zero falsas alarmas críticas de proctoring
- [ ] Un estudiante puede completar un examen sin fricción técnica
- [ ] El dashboard de GitHub muestra todas las entregas en una vista
- [ ] Los emails de feedback se envían en < 5 segundos
- [ ] La aplicación carga en < 2 segundos (LCP)
- [ ] Zero errores críticos en producción durante la primera semana

---

## 🛠️ Stack Técnico - Recordatorio

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Estilos:** Tailwind CSS
- **Markdown:** react-markdown + gray-matter
- **Estado:** React Context API
- **Forms:** React Hook Form (opcional)

### Backend

- **BaaS:** Firebase
  - Auth (Google, Email/Password)
  - Firestore (NoSQL)
  - Functions (Node.js)
  - Storage (opcional para assets)

### APIs Externas

- **IA:** Gemini API / OpenAI API
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
