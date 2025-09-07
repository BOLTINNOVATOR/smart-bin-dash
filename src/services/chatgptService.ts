interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface WasteClassificationResult {
  category: 'Organic' | 'Inorganic' | 'Hazardous';
  confidence: number;
  tips: string;
  reasoning: string;
}

class ChatGPTService {
  private apiKey: string | null = null;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async classifyWaste(imageBase64: string): Promise<WasteClassificationResult> {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure your OpenAI API key.');
    }

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: ChatGPTResponse = await response.json();
      const content = data.choices[0]?.message?.content;
      
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
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure your OpenAI API key.');
    }

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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: ChatGPTResponse = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }
}

export const chatGPTService = new ChatGPTService();