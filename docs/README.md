# Documentación de Cursos

Esta carpeta contiene la documentación generada automáticamente para cada curso.

## Estructura

```
docs/
├── [courseId]/
│   ├── 01-titulo-sesion-1.md
│   ├── 02-titulo-sesion-2.md
│   └── ...
```

## Metadata

Cada archivo `.md` incluye metadata en formato frontmatter:

```markdown
---
course: Nombre del Curso
session: 1
title: Título de la Sesión
date: 2025-11-17T...
---
```

## Uso

Los archivos se generan y sincronizan automáticamente desde la plataforma Z-SUIT.
Puedes editarlos manualmente y reimportarlos a la plataforma.
