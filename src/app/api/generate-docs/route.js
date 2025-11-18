import { generateDocumentation } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { courseName, sessionNumber, sessionTitle, keyTopics } = await request.json();

    // Validación básica
    if (!courseName || !sessionNumber || !sessionTitle || !keyTopics) {
      return Response.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const result = await generateDocumentation(
      courseName,
      sessionNumber,
      sessionTitle,
      keyTopics
    );

    if (result.success) {
      return Response.json({ success: true, documentation: result.documentation });
    } else {
      return Response.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return Response.json(
      { success: false, error: error.message || 'Error al generar documentación' },
      { status: 500 }
    );
  }
}
