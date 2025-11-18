// Gemini AI Helper Functions
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateDocumentation(
  courseName,
  sessionNumber,
  sessionTitle,
  keyTopics
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
### ROL
Actúa como un Experto en Documentación Técnica y Pedagogía Avanzada. Tu objetivo es transformar los temas clave de esta sesión en una "Guía de Estudio Maestra" optimizada para repasar antes de un examen técnico o entrevista.

### CONTEXTO
Curso: ${courseName}
Sesión ${sessionNumber}: ${sessionTitle}
Temas a desarrollar: ${keyTopics}

### INSTRUCCIONES DE PROCESAMIENTO
1. **Análisis y Expansión:** Detecta el tema central de la sesión. Define cada concepto y conéctalos lógicamente.
2. **Claridad Absoluta:** Elimina la jerga innecesaria. Si usas un término complejo, defínelo brevemente entre paréntesis.
3. **Enfoque de Examen:** Identifica qué partes son cruciales para memorizar o entender a profundidad.

### FORMATO DE SALIDA (ESTRICTO)
La salida debe seguir esta estructura jerárquica para facilitar el escaneo visual:

# ${sessionTitle}

## Concepto Core
> *Una definición de 1 o 2 frases que resuma el "qué" y el "para qué" sirve este tema. Sin rodeos.*

## Desglose Teórico
Explica los puntos clave basándote en los temas proporcionados.
- Usa **negritas** para términos clave.
- Usa listas para enumerar características.
- Si el concepto es abstracto, usa una analogía breve (ej: "Piensa en el DOM como un árbol genealógico...").
- Desarrolla cada subtema en subsecciones con ###

## Código Comentado
(Si el tema lo requiere, incluye ejemplos de código).
Muestra el código limpio, pero añade comentarios encima de las líneas críticas explicando qué hacen.
\`\`\`javascript
// Comentario explicativo
const ejemplo = "valor";
\`\`\`

## Trampas Comunes / Ojo al dato
Sección vital para exámenes.
- Menciona errores comunes.
- Casos borde (Edge cases).
- Diferencias sutiles entre conceptos relacionados.

## Resumen Flash (TL;DR)
Una tabla o lista muy breve para memorización rápida con los puntos más importantes.

---

REGLAS IMPORTANTES:
- NO uses emojis en los títulos, solo en los ## principales para identificación rápida
- Cada sección debe ser completa y autosuficiente
- Enfócate en lo que realmente se pregunta en exámenes
- Usa formato Markdown correctamente
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, documentation: text };
  } catch (error) {
    console.error("Error generating documentation:", error);
    return { success: false, error: error.message };
  }
}
