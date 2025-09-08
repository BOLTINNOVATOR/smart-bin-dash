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
  async classifyWaste(imageBase64: string): Promise<WasteClassificationResult> {
    try {
      const response = await fetch('https://iryafwncdeknceznkoff.supabase.co/functions/v1/classify-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result: WasteClassificationResult = await response.json();
      return result;
    } catch (error) {
      console.error('Waste classification error:', error);
      // Fallback response
      return {
        category: 'Inorganic',
        confidence: 0.7,
        tips: 'Please check local disposal guidelines.',
        reasoning: 'Unable to classify due to service error.'
      };
    }
  }

  async chatWithBot(message: string): Promise<string> {
    try {
      const response = await fetch('https://iryafwncdeknceznkoff.supabase.co/functions/v1/chat-with-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Chat error:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
    }
  }
}

export const aiService = new AIService();