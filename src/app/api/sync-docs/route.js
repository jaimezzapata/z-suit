import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const { courseId, courseName, courseCode } = await request.json();

    if (!courseId) {
      return Response.json(
        { success: false, error: 'courseId es requerido' },
        { status: 400 }
      );
    }

    // Buscar carpeta por múltiples criterios
    const docsRoot = join(process.cwd(), 'docs');
    const possibleFolders = [
      courseId,
      courseCode,
      courseName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    ].filter(Boolean);

    let docsDir = null;
    for (const folder of possibleFolders) {
      const testPath = join(docsRoot, folder);
      if (existsSync(testPath)) {
        docsDir = testPath;
        break;
      }
    }

    if (!docsDir) {
      return Response.json(
        { 
          success: false, 
          error: 'No se encontró carpeta en docs/',
          hint: `Crea una carpeta con alguno de estos nombres: ${possibleFolders.join(', ')}`,
          possibleFolders 
        },
        { status: 404 }
      );
    }

    // Leer todos los archivos .md del directorio
    const files = await readdir(docsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      return Response.json(
        { success: false, error: 'No se encontraron archivos .md' },
        { status: 404 }
      );
    }

    // Leer contenido de cada archivo
    const sessions = await Promise.all(
      mdFiles.map(async (fileName) => {
        const filePath = join(docsDir, fileName);
        const content = await readFile(filePath, 'utf-8');

        // Extraer metadata del frontmatter
        const metadataMatch = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
        
        let metadata = {};
        let documentation = content;

        if (metadataMatch) {
          const metadataStr = metadataMatch[1];
          documentation = metadataMatch[2];

          // Parsear metadata simple (formato key: value)
          metadataStr.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
              metadata[key.trim()] = valueParts.join(':').trim();
            }
          });
        }

        // Extraer número de sesión del nombre del archivo (ej: 01-titulo.md)
        const sessionNumberMatch = fileName.match(/^(\d+)-/);
        const sessionNumber = sessionNumberMatch 
          ? parseInt(sessionNumberMatch[1], 10) 
          : null;

        return {
          fileName,
          sessionNumber,
          title: metadata.title || fileName.replace(/^\d+-/, '').replace('.md', ''),
          documentation,
          metadata
        };
      })
    );

    // Ordenar por número de sesión
    sessions.sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0));

    return Response.json({
      success: true,
      sessions,
      message: `${sessions.length} sesiones encontradas`
    });

  } catch (error) {
    console.error('Error syncing from docs:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Endpoint para sincronizar TODAS las carpetas en docs/
export async function GET() {
  try {
    const docsRoot = join(process.cwd(), 'docs');

    if (!existsSync(docsRoot)) {
      return Response.json(
        { success: false, error: 'La carpeta docs/ no existe' },
        { status: 404 }
      );
    }

    const entries = await readdir(docsRoot, { withFileTypes: true });
    const courseDirs = entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => e.name);

    const allCourses = [];

    for (const courseId of courseDirs) {
      const courseDir = join(docsRoot, courseId);
      const files = await readdir(courseDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      if (mdFiles.length > 0) {
        allCourses.push({
          courseId,
          fileCount: mdFiles.length,
          files: mdFiles
        });
      }
    }

    return Response.json({
      success: true,
      courses: allCourses,
      message: `${allCourses.length} cursos encontrados en /docs`
    });

  } catch (error) {
    console.error('Error listing docs:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
