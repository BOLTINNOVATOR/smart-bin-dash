import * as tf from '@tensorflow/tfjs';

// Configuration
const WASTE_DETECTION_CONFIG = {
  modelUrl: process.env.WASTE_DETECTION_API_URL || '/models/waste-classifier/model.json',
  confidenceThreshold: 0.6,
  maxPredictions: 3,
  imageSize: 224,
};

// Waste categories based on SWM Rules 2016
export const WASTE_CATEGORIES = {
  wet: {
    id: 'wet',
    name: 'Wet Waste (Organic)',
    description: 'Biodegradable waste including food scraps, peels, garden waste',
    color: '#4ade80', // green-400
    bins: ['kitchen scraps', 'fruit peels', 'vegetable waste', 'garden trimmings'],
    handling: 'Compost at home or designated composting facility'
  },
  dry: {
    id: 'dry', 
    name: 'Dry Waste (Recyclable)',
    description: 'Non-biodegradable recyclable materials',
    color: '#60a5fa', // blue-400
    bins: ['paper', 'plastic', 'metal', 'glass', 'cardboard'],
    handling: 'Clean and place in dry waste bin for recycling'
  },
  hazardous: {
    id: 'hazardous',
    name: 'Domestic Hazardous Waste',
    description: 'Materials that can harm environment or health',
    color: '#f87171', // red-400
    bins: ['batteries', 'medicines', 'paint', 'pesticides', 'e-waste'],
    handling: 'Collect separately for specialized disposal'
  }
} as const;

export type WasteCategory = keyof typeof WASTE_CATEGORIES;

export interface DetectionResult {
  category: WasteCategory;
  confidence: number;
  subCategory?: string;
  suggestions: string[];
  safetyWarnings?: string[];
}

export interface ClassificationRecord {
  id: string;
  imageUrl: string;
  predictions: DetectionResult[];
  timestamp: string;
  verified?: boolean;
  userId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

class WasteDetectionService {
  private model: tf.LayersModel | null = null;
  private isLoading = false;

  private readonly mockPredictions = [
    // Wet waste examples
    { keywords: ['banana', 'apple', 'orange', 'fruit', 'peel', 'food', 'vegetable'], category: 'wet', subCategories: ['fruit peels', 'food scraps', 'vegetable waste'] },
    { keywords: ['leaf', 'grass', 'garden', 'plant', 'flower'], category: 'wet', subCategories: ['garden waste', 'plant matter'] },
    
    // Dry waste examples  
    { keywords: ['bottle', 'plastic', 'container', 'bag'], category: 'dry', subCategories: ['plastic containers', 'bottles'] },
    { keywords: ['paper', 'newspaper', 'cardboard', 'box'], category: 'dry', subCategories: ['paper waste', 'cardboard'] },
    { keywords: ['can', 'metal', 'aluminum', 'steel'], category: 'dry', subCategories: ['metal containers'] },
    { keywords: ['glass', 'jar', 'wine'], category: 'dry', subCategories: ['glass containers'] },
    
    // Hazardous waste examples
    { keywords: ['battery', 'cell', 'lithium'], category: 'hazardous', subCategories: ['batteries'] },
    { keywords: ['medicine', 'pills', 'tablet', 'syringe'], category: 'hazardous', subCategories: ['medical waste'] },
    { keywords: ['paint', 'chemical', 'cleaner'], category: 'hazardous', subCategories: ['chemicals'] },
    { keywords: ['phone', 'electronic', 'computer', 'wire'], category: 'hazardous', subCategories: ['e-waste'] },
  ];

  async loadModel(): Promise<void> {
    if (this.model || this.isLoading) return;
    
    this.isLoading = true;
    try {
      // In a real implementation, load the actual model
      // this.model = await tf.loadLayersModel(WASTE_DETECTION_CONFIG.modelUrl);
      
      // For demo, simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Waste detection model loaded (mock)');
    } catch (error) {
      console.error('Failed to load waste detection model:', error);
      // Fallback to mock predictions
    } finally {
      this.isLoading = false;
    }
  }

  private generateMockPrediction(imageFile?: File): DetectionResult[] {
    // Simple mock based on filename or random selection
    let selectedCategory: WasteCategory = 'wet';
    let subCategory = 'food scraps';
    let confidence = 0.85;

    if (imageFile) {
      const filename = imageFile.name.toLowerCase();
      
      for (const prediction of this.mockPredictions) {
        if (prediction.keywords.some(keyword => filename.includes(keyword))) {
          selectedCategory = prediction.category as WasteCategory;
          subCategory = prediction.subCategories[0];
          confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
          break;
        }
      }
    } else {
      // Random category for webcam captures
      const categories = Object.keys(WASTE_CATEGORIES) as WasteCategory[];
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
    }

    const categoryInfo = WASTE_CATEGORIES[selectedCategory];
    
    const suggestions = [
      categoryInfo.handling,
      `Bin type: ${categoryInfo.name}`,
      `Estimated weight: ${(Math.random() * 2 + 0.5).toFixed(1)}kg`
    ];

    const safetyWarnings = selectedCategory === 'hazardous' ? [
      'Handle with care - potential safety hazard',
      'Use appropriate protective equipment',
      'Do not dispose in regular waste bins'
    ] : undefined;

    // Generate 2-3 predictions with decreasing confidence
    const results: DetectionResult[] = [
      {
        category: selectedCategory,
        confidence,
        subCategory,
        suggestions,
        safetyWarnings
      }
    ];

    // Add alternative predictions
    const otherCategories = (Object.keys(WASTE_CATEGORIES) as WasteCategory[])
      .filter(cat => cat !== selectedCategory);
    
    if (otherCategories.length > 0 && confidence < 0.9) {
      results.push({
        category: otherCategories[0],
        confidence: Math.max(0.1, confidence - 0.3),
        subCategory: WASTE_CATEGORIES[otherCategories[0]].bins[0],
        suggestions: [WASTE_CATEGORIES[otherCategories[0]].handling]
      });
    }

    return results;
  }

  async detectWaste(imageSource: File | string): Promise<DetectionResult[]> {
    await this.loadModel();

    try {
      if (this.model) {
        // Real ML inference would happen here
        // const tensor = await this.preprocessImage(imageSource);
        // const predictions = await this.model.predict(tensor) as tf.Tensor;
        // return this.postprocessPredictions(predictions);
      }

      // Fallback to mock predictions
      const imageFile = imageSource instanceof File ? imageSource : undefined;
      return this.generateMockPrediction(imageFile);
      
    } catch (error) {
      console.error('Error in waste detection:', error);
      throw new Error('Failed to classify waste. Please try again.');
    }
  }

  private async preprocessImage(imageSource: File | string): Promise<tf.Tensor> {
    // Convert image to tensor and resize to model input size
    const img = imageSource instanceof File 
      ? await this.fileToImageElement(imageSource)
      : await this.urlToImageElement(imageSource);
    
    return tf.browser.fromPixels(img)
      .resizeNearestNeighbor([WASTE_DETECTION_CONFIG.imageSize, WASTE_DETECTION_CONFIG.imageSize])
      .expandDims(0)
      .div(255.0);
  }

  private async fileToImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async urlToImageElement(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);  
      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  getWasteHandlingGuide(category: WasteCategory): string[] {
    const categoryInfo = WASTE_CATEGORIES[category];
    
    const guides = {
      wet: [
        "Remove any plastic packaging or non-organic materials",
        "Chop large items into smaller pieces for faster decomposition", 
        "Consider home composting for garden use",
        "Keep separate from dry waste to prevent contamination"
      ],
      dry: [
        "Clean containers and remove food residue",
        "Remove labels and caps when possible", 
        "Flatten cardboard boxes to save space",
        "Separate different materials (plastic, paper, metal, glass)"
      ],
      hazardous: [
        "Never mix with regular waste",
        "Store in original containers when possible",
        "Keep away from children and pets",
        "Use designated collection points for disposal",
        "Check with local authorities for proper disposal methods"
      ]
    };

    return [categoryInfo.handling, ...guides[category]];
  }

  createClassificationRecord(
    imageUrl: string, 
    predictions: DetectionResult[], 
    userId?: string,
    location?: { lat: number; lng: number }
  ): ClassificationRecord {
    return {
      id: `cls-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl,
      predictions,
      timestamp: new Date().toISOString(),
      userId,
      location
    };
  }
}

// Export singleton instance
export const wasteDetectionService = new WasteDetectionService();

// Utility functions
export const getWasteCategoryColor = (category: WasteCategory): string => {
  return WASTE_CATEGORIES[category].color;
};

export const getConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
};

export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};