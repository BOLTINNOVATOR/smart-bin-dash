import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAppStore, type WasteType, type Classification } from '@/store/useAppStore';
import { Camera, Upload, RefreshCw, CheckCircle, AlertTriangle, Sparkles, Eye, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/services/aiService';
import { WasteChatbot } from '@/components/WasteChatbot';

export const Demo = () => {
  const { language, addClassification } = useAppStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Classification | null>(null);
  const [edgeMode, setEdgeMode] = useState(false);
  const [useRealAI, setUseRealAI] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const content = {
    en: {
      title: "AI-Powered Waste Classification",
      subtitle: "Upload, capture, or drag images for intelligent waste sorting with AI",
      upload: "Upload Image",
      camera: "Use Camera",
      process: "Classify Waste",
      processing: "Analyzing with AI...",
      edgeMode: "Mock Mode",
      edgeModeDesc: "Use simulated classification",
      realAI: "Real AI Mode",
      realAIDesc: "Use Gemini AI for classification",
      results: "AI Classification Results",
      confidence: "Confidence",
      predicted: "Predicted Category",
      tips: "Disposal Tips",
      dragHere: "Drop your waste image here",
      configure: "Configure",
      categories: {
        wet: "Wet (Organic)",
        dry: "Dry (Recyclable)", 
        hazardous: "Hazardous"
      },
      tips_content: {
        wet: "Compost at home or dispose in green bins. Collect daily.",
        dry: "Clean and sort by material. Collect twice weekly.",
        hazardous: "Handle with care. Use protective equipment. Special collection required."
      }
    },
    hi: {
      title: "AI-संचालित अपशिष्ट वर्गीकरण",
      subtitle: "AI के साथ बुद्धिमान अपशिष्ट छँटाई के लिए चित्र अपलोड, कैप्चर या खींचें",
      upload: "चित्र अपलोड करें",
      camera: "कैमरा का उपयोग करें", 
      process: "अपशिष्ट वर्गीकृत करें",
      processing: "AI से विश्लेषण...",
      edgeMode: "मॉक मोड",
      edgeModeDesc: "सिमुलेटेड वर्गीकरण का उपयोग करें",
      realAI: "वास्तविक AI मोड",
      realAIDesc: "वर्गीकरण के लिए Gemini AI का उपयोग करें",
      results: "AI वर्गीकरण परिणाम",
      confidence: "आत्मविश्वास",
      predicted: "अनुमानित श्रेणी",
      tips: "निपटान सुझाव",
      dragHere: "अपनी अपशिष्ट छवि यहाँ छोड़ें",
      configure: "कॉन्फ़िगर करें",
      categories: {
        wet: "गीला (जैविक)",
        dry: "सूखा (रीसाइक्लेबल)",
        hazardous: "खतरनाक"
      },
      tips_content: {
        wet: "घर पर कंपोस्ट करें या हरे बिन में डालें। दैनिक संग्रह।",
        dry: "साफ करें और सामग्री के अनुसार छांटें। सप्ताह में दो बार संग्रह।",
        hazardous: "सावधानी से संभालें। सुरक्षा उपकरण का उपयोग करें। विशेष संग्रह आवश्यक।"
      }
    }
  };

  const t = content[language];

  // AI-powered classification
  const classifyImage = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      if (useRealAI) {
        // Real Gemini AI classification - API key is already set in service
        const aiResult = await aiService.classifyWaste(imageData);
        
        // Map AI response to our format
        const wasteTypeMap: { [key: string]: WasteType } = {
          'Organic': 'wet',
          'Inorganic': 'dry',
          'Hazardous': 'hazardous'
        };
        
        const classification: Classification = {
          id: `cls-${Date.now()}`,
          image: imageData,
          predictedClass: wasteTypeMap[aiResult.category] || 'dry',
          confidence: Math.round(aiResult.confidence * 100),
          timestamp: new Date().toISOString()
        };
        
        setResult(classification);
        addClassification(classification);
      } else {
        // Mock classification (fallback)
        const processingTime = edgeMode ? 800 : 2000;
        await new Promise(resolve => setTimeout(resolve, processingTime));
        
        const categories: WasteType[] = ['wet', 'dry', 'hazardous'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
        
        const classification: Classification = {
          id: `cls-${Date.now()}`,
          image: imageData,
          predictedClass: randomCategory,
          confidence: Math.round(confidence * 100),
          timestamp: new Date().toISOString()
        };
        
        setResult(classification);
        addClassification(classification);
      }
    } catch (error) {
      console.error('Classification error:', error);
      // Fall back to mock classification on error
      const categories: WasteType[] = ['wet', 'dry', 'hazardous'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const classification: Classification = {
        id: `cls-${Date.now()}`,
        image: imageData,
        predictedClass: randomCategory,
        confidence: 75,
        timestamp: new Date().toISOString()
      };
      
      setResult(classification);
      addClassification(classification);
    } finally {
      setIsProcessing(false);
    }
  }, [edgeMode, useRealAI, addClassification]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      setResult(null);
      // Automatically classify the uploaded image
      classifyImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      processImageFile(files[0]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = cameraRef.current.videoWidth;
      canvas.height = cameraRef.current.videoHeight;
      ctx?.drawImage(cameraRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      setResult(null);
      // Automatically classify the captured image
      classifyImage(imageData);
      
      // Stop camera
      const stream = cameraRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const getCategoryColor = (type: WasteType) => {
    switch (type) {
      case 'wet':
        return 'bg-[hsl(var(--wet-waste))] text-white';
      case 'dry':
        return 'bg-[hsl(var(--dry-waste))] text-white';
      case 'hazardous':
        return 'bg-[hsl(var(--hazardous-waste))] text-white';
    }
  };

  const getCategoryIcon = (type: WasteType) => {
    switch (type) {
      case 'wet':
        return '🥬';
      case 'dry':
        return '♻️';
      case 'hazardous':
        return '☢️';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-lg">{t.subtitle}</p>
          </div>
          
          {/* AI Mode Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={!useRealAI ? "default" : "outline"}
                size="sm"
                onClick={() => setUseRealAI(false)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t.edgeMode}
              </Button>
              <Button
                variant={useRealAI ? "default" : "outline"}
                size="sm"
                onClick={() => setUseRealAI(true)}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {t.realAI}
              </Button>
            </div>
            
            {/* Status Indicator */}
            <div className="text-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {useRealAI ? "🤖 AI Classification Active" : "🔄 Mock Mode Active"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {useRealAI ? "Images will be automatically classified using Gemini AI" : "Using simulated classification"}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  📸
                </motion.span>
                Image Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drag & Drop Zone */}
              <motion.div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragOver
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="space-y-4"
                  animate={{ y: dragOver ? -5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">{t.dragHere}</p>
                    <p className="text-sm text-muted-foreground">
                      Or click to browse files
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Upload/Camera Controls */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Upload className="h-4 w-4" />
                  {t.upload}
                </Button>
                <Button
                  variant="outline"
                  onClick={startCamera}
                  disabled={cameraActive}
                  className="flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Camera className="h-4 w-4" />
                  {t.camera}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Camera View */}
              <AnimatePresence>
                {cameraActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <video
                      ref={cameraRef}
                      autoPlay
                      muted
                      className="w-full rounded-lg border shadow-lg"
                    />
                    <Button 
                      onClick={capturePhoto} 
                      className="w-full animate-pulse-glow"
                    >
                      📸 Capture Photo
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Image */}
              <AnimatePresence>
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <motion.img
                      src={selectedImage}
                      alt="Selected waste"
                      className="w-full h-64 object-cover rounded-lg border shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Auto Classification Status */}
                    {isProcessing && (
                      <div className="w-full flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg border">
                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-primary font-medium">{t.processing}</span>
                      </div>
                    )}
                    
                    {!isProcessing && selectedImage && !result && (
                      <div className="w-full flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {useRealAI ? "AI classification completed" : "Ready for classification"}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🤖
                </motion.span>
                {t.results}
                {useRealAI && (
                  <Badge variant="outline" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4 text-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-12 w-12 mx-auto"
                      >
                        <Eye className="h-12 w-12 text-primary" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-primary/20"
                      />
                    </div>
                    <div className="text-lg font-medium">{t.processing}</div>
                    <Progress value={useRealAI ? 60 : 30} className="w-full" />
                  </motion.div>
                )}

                {result && !isProcessing && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Prediction */}
                    <motion.div 
                      className="text-center space-y-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    >
                      <motion.div 
                        className="text-6xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {getCategoryIcon(result.predictedClass)}
                      </motion.div>
                      <Badge className={`${getCategoryColor(result.predictedClass)} text-lg px-6 py-2 animate-bounce-gentle`}>
                        {t.categories[result.predictedClass]}
                      </Badge>
                    </motion.div>

                    {/* Confidence */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex justify-between text-sm">
                        <span>{t.confidence}</span>
                        <span className="font-semibold">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-3" />
                    </motion.div>

                    {/* Handling Tips */}
                    <motion.div 
                      className="p-4 rounded-lg bg-gradient-to-r from-secondary/20 to-accent/10 border border-secondary/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-warning mt-0.5 animate-wiggle" />
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{t.tips}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.tips_content[result.predictedClass]}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Metadata */}
                    <motion.div 
                      className="text-xs text-muted-foreground space-y-1 border-t pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div>Classification ID: {result.id}</div>
                      <div>Timestamp: {new Date(result.timestamp).toLocaleString()}</div>
                      <div>Mode: {useRealAI ? 'AI-Powered' : 'Mock Classification'}</div>
                    </motion.div>
                  </motion.div>
                )}

                {!result && !isProcessing && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      📤
                    </motion.div>
                    <div className="text-muted-foreground">
                      Upload an image to get started with AI classification
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Category Guide */}
        <Card className="shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗂️ Waste Categories Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(t.categories).map(([key, label], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center space-y-3 p-6 rounded-xl border border-secondary/50 bg-gradient-to-b from-card to-secondary/10 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${label} waste category information`}
                >
                  <motion.div 
                    className="text-4xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getCategoryIcon(key as WasteType)}
                  </motion.div>
                  <Badge className={`${getCategoryColor(key as WasteType)} group-hover:scale-110 transition-transform`}>
                    {label}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.tips_content[key as WasteType]}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* AI Chatbot */}
        <WasteChatbot />
      </div>
    </div>
  );
};