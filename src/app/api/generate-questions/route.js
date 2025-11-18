import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDocumentById, updateExam } from '@/lib/firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { examId, courseId, questionCount } = await request.json();

    // Obtener el curso
    const courseResult = await getDocumentById('courses', courseId);
    if (!courseResult.success) {
      return NextResponse.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
    }

    const course = courseResult.data;

    // Recopilar toda la documentación del curso
    const documentation = course.sessions
      .filter(session => session.documentation)
      .map((session, index) => `
## Sesión ${index + 1}: ${session.title || 'Sin título'}

${session.documentation}
      `)
      .join('\n\n---\n\n');

    if (!documentation) {
      return NextResponse.json({ 
        success: false, 
        error: 'No hay documentación disponible en el curso' 
      }, { status: 400 });
    }

    // Preparar el prompt para Gemini
    const prompt = `Eres un profesor experto creando un examen de opción múltiple.

CONTEXTO DEL CURSO:
Nombre: ${course.name}
Nivel: ${course.nivel}
Descripción: ${course.description || 'No disponible'}

DOCUMENTACIÓN COMPLETA DEL CURSO:
${documentation}

TAREA:
Genera exactamente ${questionCount} preguntas de opción múltiple basadas en la documentación proporcionada.

REQUISITOS:
1. Las preguntas deben cubrir diferentes temas del curso de manera equilibrada
2. Cada pregunta debe tener 4 opciones (A, B, C, D)
3. Solo UNA opción debe ser correcta
4. Las preguntas deben ser claras y precisas
5. Evita preguntas triviales o muy obvias
6. Las preguntas deben evaluar comprensión, no memorización literal
7. Incluye preguntas de diferentes niveles de dificultad

FORMATO DE RESPUESTA (JSON estricto):
{
  "questions": [
    {
      "question": "Texto de la pregunta",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": 0,
      "explanation": "Breve explicación de por qué esta es la respuesta correcta",
      "difficulty": "easy|medium|hard"
    }
  ]
}

IMPORTANTE: 
- Responde SOLO con el JSON, sin texto adicional antes o después
- El índice de correctAnswer va de 0 a 3 (0=A, 1=B, 2=C, 3=D)
- Asegúrate de generar exactamente ${questionCount} preguntas`;

    // Generar preguntas con Gemini (usando el mismo modelo que funciona en generateDocumentation)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear el JSON
    let questions;
    try {
      // Limpiar el texto de posibles markdown code blocks
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);
      questions = parsed.questions;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json({ 
        success: false, 
        error: 'Error al parsear la respuesta de la IA',
        details: text 
      }, { status: 500 });
    }

    if (!Array.isArray(questions) || questions.length !== questionCount) {
      return NextResponse.json({ 
        success: false, 
        error: `Se esperaban ${questionCount} preguntas, pero se generaron ${questions?.length || 0}` 
      }, { status: 500 });
    }

    // Actualizar el examen con las preguntas generadas
    const questionsWithIds = questions.map((q, index) => ({
      id: `q${index + 1}`,
      ...q
    }));

    await updateExam(examId, { 
      questions: questionsWithIds,
      status: 'draft' 
    });

    return NextResponse.json({
      success: true,
      questions: questionsWithIds
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Manejar errores específicos de quota
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Has excedido el límite de uso de la API de Gemini. Por favor espera unos minutos e intenta nuevamente.',
        retryAfter: 60
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error desconocido al generar preguntas'
    }, { status: 500 });
  }
}
