import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const { courseId, courseName, courseCode, sessionNumber, sessionTitle, content } = await request.json();

    if (!courseId || !content) {
      return Response.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Buscar carpeta existente o usar courseCode como preferencia
    const docsRoot = join(process.cwd(), 'docs');
    const possibleFolders = [
      courseCode,
      courseId,
      courseName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    ].filter(Boolean);

    let docsDir = null;
    let usedFolderName = null;

    // Buscar carpeta existente
    for (const folder of possibleFolders) {
      const testPath = join(docsRoot, folder);
      if (existsSync(testPath)) {
        docsDir = testPath;
        usedFolderName = folder;
        break;
      }
    }

    // Si no existe, crear con courseCode (preferencia) o courseId
    if (!docsDir) {
      usedFolderName = courseCode || courseId;
      docsDir = join(docsRoot, usedFolderName);
      await mkdir(docsDir, { recursive: true });
    }

    // Sanitizar nombre de archivo
    const sanitizedTitle = sessionTitle
      ? sessionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : `session-${sessionNumber}`;
    
    const fileName = `${String(sessionNumber).padStart(2, '0')}-${sanitizedTitle}.md`;
    const filePath = join(docsDir, fileName);

    // Agregar metadata al inicio del archivo
    const fileContent = `---
course: ${courseName}
session: ${sessionNumber}
title: ${sessionTitle}
date: ${new Date().toISOString()}
---

${content}`;

    // Guardar archivo
    await writeFile(filePath, fileContent, 'utf-8');

    return Response.json({
      success: true,
      path: `docs/${usedFolderName}/${fileName}`,
      folderName: usedFolderName,
      message: 'Archivo guardado correctamente'
    });

  } catch (error) {
    console.error('Error saving markdown file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint para leer archivos guardados
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const courseName = searchParams.get('courseName');
    const courseCode = searchParams.get('courseCode');
    const sessionNumber = searchParams.get('sessionNumber');

    if (!courseId || !sessionNumber) {
      return Response.json(
        { success: false, error: 'Faltan parámetros' },
        { status: 400 }
      );
    }

    // Buscar carpeta por múltiples criterios
    const docsRoot = join(process.cwd(), 'docs');
    const possibleFolders = [
      courseCode,
      courseId,
      courseName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    ].filter(Boolean);

    let docsDir = null;
    let usedFolderName = null;

    for (const folder of possibleFolders) {
      const testPath = join(docsRoot, folder);
      if (existsSync(testPath)) {
        docsDir = testPath;
        usedFolderName = folder;
        break;
      }
    }
    
    if (!docsDir) {
      return Response.json(
        { success: false, error: 'No hay archivos guardados' },
        { status: 404 }
      );
    }

    // Buscar archivo que coincida con el número de sesión
    const { readdir, readFile } = await import('fs/promises');
    const files = await readdir(docsDir);
    const targetFile = files.find(f => f.startsWith(String(sessionNumber).padStart(2, '0')));

    if (!targetFile) {
      return Response.json(
        { success: false, error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    const filePath = join(docsDir, targetFile);
    const content = await readFile(filePath, 'utf-8');

    // Remover metadata del contenido
    const contentWithoutMeta = content.replace(/^---[\s\S]*?---\n\n/, '');

    return Response.json({
      success: true,
      content: contentWithoutMeta,
      fileName: targetFile,
      path: `docs/${usedFolderName}/${targetFile}`
    });

  } catch (error) {
    console.error('Error reading markdown file:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
