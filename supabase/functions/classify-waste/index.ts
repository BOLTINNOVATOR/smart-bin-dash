import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WasteClassificationResult {
  category: 'Organic' | 'Inorganic' | 'Hazardous';
  confidence: number;
  tips: string;
  reasoning: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing waste classification request...');

    // Convert base64 to the format OpenAI expects
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert waste management AI assistant. Analyze waste item images and classify them into one of these categories:
            - Organic: Food scraps, biodegradable materials, garden waste
            - Inorganic: Recyclable materials like plastic, glass, metal, paper, cardboard
            - Hazardous: Toxic, dangerous, electronic waste, batteries, chemicals
            
            Always respond in this exact JSON format:
            {
              "category": "Organic|Inorganic|Hazardous",
              "confidence": 0.95,
              "tips": "Brief disposal tip (max 100 characters)",
              "reasoning": "Brief explanation why you classified it this way (max 150 characters)"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this waste item and classify it according to the categories provided. Return only the JSON response.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    try {
      const result: WasteClassificationResult = JSON.parse(content);
      console.log('Classification result:', result);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      // Fallback response
      const fallbackResult: WasteClassificationResult = {
        category: 'Inorganic',
        confidence: 0.7,
        tips: 'Please check local disposal guidelines.',
        reasoning: 'Unable to parse detailed classification.'
      };
      
      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in classify-waste function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      category: 'Inorganic',
      confidence: 0.5,
      tips: 'Classification temporarily unavailable.',
      reasoning: 'Service error occurred.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});