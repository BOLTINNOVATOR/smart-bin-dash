import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore, type WasteType, type Classification } from '@/store/useAppStore';
import { Camera, Upload, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Demo = () => {
  const { language, addClassification } = useAppStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Classification | null>(null);
  const [edgeMode, setEdgeMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const content = {
    en: {
      title: "Smart Bin ML Demo",
      subtitle: "Upload or capture waste images for automatic classification",
      upload: "Upload Image",
      camera: "Use Camera",
      process: "Classify Waste",
      processing: "Processing...",
      edgeMode: "Edge Mode",
      edgeModeDesc: "Simulate on-device inference",
      results: "Classification Results",
      confidence: "Confidence",
      predicted: "Predicted Category",
      tips: "Handling Tips",
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
      title: "स्मार्ट बिन ML डेमो",
      subtitle: "स्वचालित वर्गीकरण के लिए अपशिष्ट चित्र अपलोड या कैप्चर करें",
      upload: "चित्र अपलोड करें",
      camera: "कैमरा का उपयोग करें",
      process: "अपशिष्ट वर्गीकृत करें",
      processing: "प्रसंस्करण...",
      edgeMode: "एज मोड",
      edgeModeDesc: "ऑन-डिवाइस इंफेरेंस का अनुकरण करें",
      results: "वर्गीकरण परिणाम",
      confidence: "आत्मविश्वास",
      predicted: "अनुमानित श्रेणी",
      tips: "हैंडलिंग टिप्स",
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

  // Mock ML classification
  const classifyImage = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    
    // Simulate processing time (edge mode = faster)
    const processingTime = edgeMode ? 800 : 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Mock classification results
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
    setIsProcessing(false);
  }, [edgeMode, addClassification]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setResult(null);
      };
      reader.readAsDataURL(file);
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
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
          
          {/* Edge Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={edgeMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEdgeMode(!edgeMode)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t.edgeMode}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t.edgeModeDesc}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📸 Image Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload/Camera Controls */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {t.upload}
                </Button>
                <Button
                  variant="outline"
                  onClick={startCamera}
                  disabled={cameraActive}
                  className="flex items-center gap-2"
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
              {cameraActive && (
                <div className="space-y-4">
                  <video
                    ref={cameraRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg border"
                  />
                  <Button onClick={capturePhoto} className="w-full">
                    📸 Capture Photo
                  </Button>
                </div>
              )}

              {/* Selected Image */}
              {selectedImage && (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected waste"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  
                  {/* Process Button */}
                  <Button
                    onClick={() => classifyImage(selectedImage)}
                    disabled={isProcessing}
                    className="w-full flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        {t.process}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 {t.results}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing && (
                <div className="space-y-4 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <div>{t.processing}</div>
                  <Progress value={30} className="w-full" />
                </div>
              )}

              {result && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Prediction */}
                  <div className="text-center space-y-3">
                    <div className="text-4xl">
                      {getCategoryIcon(result.predictedClass)}
                    </div>
                    <Badge className={`${getCategoryColor(result.predictedClass)} text-lg px-4 py-2`}>
                      {t.categories[result.predictedClass]}
                    </Badge>
                  </div>

                  {/* Confidence */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t.confidence}</span>
                      <span className="font-semibold">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className="h-2" />
                  </div>

                  {/* Handling Tips */}
                  <div className="p-4 rounded-lg bg-secondary/20 border">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm mb-1">{t.tips}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.tips_content[result.predictedClass]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
                    <div>Classification ID: {result.id}</div>
                    <div>Timestamp: {new Date(result.timestamp).toLocaleString()}</div>
                    <div>Mode: {edgeMode ? 'Edge Inference' : 'Cloud Inference'}</div>
                  </div>
                </motion.div>
              )}

              {!result && !isProcessing && (
                <div className="text-center text-muted-foreground py-8">
                  Upload an image to get started
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Guide */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle>🗂️ Waste Categories Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(t.categories).map(([key, label]) => (
                <div key={key} className="text-center space-y-2 p-4 rounded-lg border">
                  <div className="text-3xl">{getCategoryIcon(key as WasteType)}</div>
                  <Badge className={getCategoryColor(key as WasteType)}>
                    {label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {t.tips_content[key as WasteType]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};