import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateMemeWithAI(prompt) {
  try {
    // For demo purposes, we'll simulate AI generation with placeholder images
    // In production, you would use the actual OpenAI API
    
    // Simulated API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, we'll use a placeholder image service
    const imageUrl = `https://picsum.photos/500/400?random=${Date.now()}`;
    
    // Uncomment below for actual OpenAI integration:
    /*
    const response = await openai.images.generate({
      model: "google/gemini-2.0-flash-001",
      prompt: `Create a meme image: ${prompt}. Style should be funny and internet meme-like.`,
      n: 1,
      size: "512x512",
    });
    
    const imageUrl = response.data[0].url;
    */
    
    return {
      id: Date.now(),
      prompt,
      imageUrl,
      createdAt: new Date().toISOString(),
      templateUsed: null
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate meme with AI');
  }
}