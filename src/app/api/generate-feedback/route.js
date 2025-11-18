import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDocumentById, updateExamAttempt } from '@/lib/firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { attemptId, examId, studentEmail, answers, score } = await request.json();

    // Obtener el examen
    const examResult = await getDocumentById('exams', examId);
    if (!examResult.success) {
      return NextResponse.json({ success: false, error: 'Examen no encontrado' }, { status: 404 });
    }

    const exam = examResult.data;

    // Preparar análisis de respuestas
    const analysis = exam.questions.map((question, index) => {
      const studentAnswer = answers[question.id];
      const isCorrect = studentAnswer === question.correctAnswer;
      
      return `
**Pregunta ${index + 1}:** ${question.question}

**Tu respuesta:** ${studentAnswer !== undefined ? question.options[studentAnswer] : 'No respondida'}
**Respuesta correcta:** ${question.options[question.correctAnswer]}
**Estado:** ${isCorrect ? '✅ Correcta' : '❌ Incorrecta'}

${question.explanation ? `**Explicación:** ${question.explanation}` : ''}
      `;
    }).join('\n\n---\n\n');

    const correctCount = exam.questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const totalQuestions = exam.questions.length;

    // Generar retroalimentación con IA
    const prompt = `Eres un tutor académico experto. Genera una retroalimentación constructiva y motivadora para un estudiante que acaba de presentar un examen.

INFORMACIÓN DEL EXAMEN:
Título: ${exam.title}
Calificación: ${score.toFixed(2)}/5.0
Preguntas correctas: ${correctCount}/${totalQuestions}
Porcentaje de acierto: ${((correctCount/totalQuestions)*100).toFixed(1)}%

ANÁLISIS DETALLADO DE RESPUESTAS:
${analysis}

TAREA:
Genera una retroalimentación personalizada que incluya:

1. **Mensaje de Apertura**: Un saludo motivador que reconozca el esfuerzo del estudiante

2. **Análisis de Fortalezas**: Identifica 2-3 áreas donde el estudiante demostró buen dominio

3. **Áreas de Mejora**: Señala 2-3 temas específicos que necesita reforzar (basándote en las preguntas incorrectas)

4. **Recomendaciones**: Proporciona 3-4 consejos prácticos para mejorar en los temas débiles

5. **Mensaje de Cierre**: Una conclusión motivadora y positiva

FORMATO:
Usa un tono profesional pero cercano. Sé específico y constructivo. Evita ser muy técnico.

IMPORTANTE: 
- Sé honesto pero siempre motivador
- Enfócate en el aprendizaje, no solo en la nota
- Proporciona retroalimentación accionable
- Máximo 500 palabras`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    // Guardar retroalimentación en el intento
    await updateExamAttempt(attemptId, {
      feedback: feedback,
      feedbackGeneratedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      feedback: feedback
    });

  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error al generar retroalimentación'
    }, { status: 500 });
  }
}
