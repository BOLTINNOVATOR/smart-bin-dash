interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface WasteClassificationResult {
  category: 'Organic' | 'Inorganic' | 'Hazardous';
  confidence: number;
  tips: string;
  reasoning: string;
}

class AIService {
  private apiKey: string = "AIzaSyBsDwFhmqIJzj3ahe9N9fhR5iy1_AKFzbQ";

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async classifyWaste(imageBase64: string): Promise<WasteClassificationResult> {
    const prompt = `Analyze this waste item image and classify it into one of these categories:
    - Organic: Food scraps, biodegradable materials
    - Inorganic: Recyclable materials like plastic, glass, metal, paper
    - Hazardous: Toxic, dangerous, or electronic waste

    Respond in JSON format:
    {
      "category": "Organic|Inorganic|Hazardous",
      "confidence": 0.95,
      "tips": "Brief disposal tip",
      "reasoning": "Why you classified it this way"
    }`;

    try {
      // Convert base64 to the format Gemini expects
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!content) {
        throw new Error('No response from API');
      }

      try {
        return JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
        return {
          category: 'Inorganic',
          confidence: 0.7,
          tips: 'Please check local disposal guidelines.',
          reasoning: 'Unable to parse detailed classification.'
        };
      }
    } catch (error) {
      console.error('Waste classification error:', error);
      throw error;
    }
  }

  async chatWithBot(message: string): Promise<string> {
    const systemPrompt = `You are EcoBot, a helpful AI assistant specialized in waste management and environmental sustainability. 

    Your expertise includes:
    - Waste segregation and disposal methods
    - Recycling guidelines and best practices  
    - Composting and organic waste management
    - Hazardous waste handling
    - Environmental impact and sustainability tips
    - Local waste management policies
    
    Provide clear, actionable advice. Keep responses concise but informative. Use emojis appropriately to make responses engaging.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${systemPrompt}\n\nUser: ${message}` }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();