export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Make direct REST call to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return Response.json({ 
        success: false, 
        error: data.error?.message || 'Failed to fetch models',
        data 
      }, { status: response.status });
    }
    
    // Filter models that support generateContent
    const contentModels = data.models?.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );
    
    return Response.json({ 
      success: true, 
      models: contentModels?.map(m => ({
        name: m.name,
        displayName: m.displayName,
        supportedMethods: m.supportedGenerationMethods
      })) || []
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
