import OpenAI from 'openai';

// Initialize OpenAI client with fallback to OpenRouter
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY || 'demo-key',
  baseURL: import.meta.env.VITE_OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
  dangerouslyAllowBrowser: true,
});

// Enhanced prompt engineering for better meme generation
function enhancePromptForMeme(userPrompt) {
  return `Create a high-quality meme image with the following description: ${userPrompt}. 
  
  Style requirements:
  - Clear, bold text that's easy to read
  - High contrast between text and background
  - Funny, relatable, and internet meme-style
  - Professional image quality
  - Text should be integrated naturally into the image
  - Use popular meme formats and visual styles
  - Make it shareable and engaging
  
  The image should be optimized for social media sharing.`;
}

export async function generateMemeWithAI(prompt) {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    
    // If no API key is provided, use demo mode
    if (!apiKey || apiKey === 'demo-key') {
      console.warn('No API key provided, using demo mode');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        id: Date.now(),
        prompt,
        imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
        createdAt: new Date().toISOString(),
        templateUsed: null,
        isDemo: true
      };
    }

    // Use GPT-4 to enhance the prompt first
    const enhancedPrompt = await enhancePromptWithGPT(prompt);
    
    // Generate the meme image
    const response = await openai.images.generate({
      model: import.meta.env.VITE_OPENROUTER_API_KEY ? "black-forest-labs/flux-1.1-pro" : "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url"
    });
    
    const imageUrl = response.data[0].url;
    
    return {
      id: Date.now(),
      prompt,
      enhancedPrompt,
      imageUrl,
      createdAt: new Date().toISOString(),
      templateUsed: null,
      isDemo: false
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Fallback to demo mode if API fails
    console.warn('API failed, falling back to demo mode');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      prompt,
      imageUrl: `https://picsum.photos/512/512?random=${Date.now()}`,
      createdAt: new Date().toISOString(),
      templateUsed: null,
      isDemo: true,
      error: error.message
    };
  }
}

// Use GPT-4 to enhance user prompts for better meme generation
async function enhancePromptWithGPT(userPrompt) {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      return enhancePromptForMeme(userPrompt);
    }

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENROUTER_API_KEY ? "anthropic/claude-3.5-sonnet" : "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert meme creator. Your job is to take a user's meme idea and enhance it into a detailed, specific prompt that will generate a high-quality, funny meme image.

Guidelines:
- Keep the core idea from the user
- Add specific visual details that make it funnier
- Specify text placement and style
- Reference popular meme formats when appropriate
- Make it clear what text should appear and where
- Ensure it's relatable and shareable
- Keep it appropriate and family-friendly

Return only the enhanced prompt, nothing else.`
        },
        {
          role: "user",
          content: `Enhance this meme idea: "${userPrompt}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.warn('Prompt enhancement failed, using basic enhancement:', error);
    return enhancePromptForMeme(userPrompt);
  }
}

// Generate meme suggestions based on trending topics
export async function generateMemeSuggestions() {
  const suggestions = [
    "A cat wearing sunglasses saying 'Deal with it' while knocking things off a table",
    "Drake pointing at 'AI generated memes' and rejecting 'manually made memes'",
    "Surprised pikachu face but it's a programmer seeing their code work on the first try",
    "Woman yelling at confused cat but they're both discussing JavaScript frameworks",
    "This is fine dog but the room is full of unread notifications",
    "Distracted boyfriend looking at 'New AI tool' while 'Current workflow' looks disappointed",
    "Two buttons meme: 'Fix the bug' vs 'Add more features'",
    "Galaxy brain expanding: 'Copy code' → 'Modify code' → 'Understand code' → 'Write original code'"
  ];
  
  return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
}
