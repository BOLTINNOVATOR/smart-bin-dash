import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Lightbulb, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GreenTipsWidget = () => {
  const { greenTips, language } = useAppStore();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const content = {
    en: {
      title: "Daily Green Tip",
      subtitle: "Small actions, big impact",
      previous: "Previous tip",
      next: "Next tip", 
      random: "Random tip",
      category: {
        composting: "🌱 Composting",
        recycling: "♻️ Recycling",
        reduction: "🔄 Reduction", 
        hazardous: "⚠️ Hazardous Waste"
      }
    },
    hi: {
      title: "दैनिक हरित सुझाव",
      subtitle: "छोटी कार्रवाई, बड़ा प्रभाव",
      previous: "पिछला सुझाव",
      next: "अगला सुझाव",
      random: "यादृच्छिक सुझाव",
      category: {
        composting: "🌱 कंपोस्टिंग",
        recycling: "♻️ रीसाइक्लिंग",
        reduction: "🔄 कमी",
        hazardous: "⚠️ खतरनाक कचरा"
      }
    }
  };

  const t = content[language];

  // Auto-rotate tips every 10 seconds
  useEffect(() => {
    if (greenTips.length > 1) {
      const interval = setInterval(() => {
        nextTip();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [greenTips.length, currentTipIndex]);

  // Set daily tip based on date
  useEffect(() => {
    if (greenTips.length > 0) {
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
      const tipIndex = dayOfYear % greenTips.length;
      setCurrentTipIndex(tipIndex);
    }
  }, [greenTips.length]);

  const currentTip = greenTips[currentTipIndex];

  const nextTip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTipIndex((prev) => (prev + 1) % greenTips.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const previousTip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentTipIndex((prev) => (prev - 1 + greenTips.length) % greenTips.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const randomTip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * greenTips.length);
    } while (newIndex === currentTipIndex && greenTips.length > 1);
    setCurrentTipIndex(newIndex);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getCategoryIcon = (category: string) => {
    const categoryKey = category as keyof typeof t.category;
    return t.category[categoryKey] || "💡";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'composting':
        return 'bg-[hsl(var(--wet-waste)/0.1)] border-[hsl(var(--wet-waste))]';
      case 'recycling':
        return 'bg-[hsl(var(--dry-waste)/0.1)] border-[hsl(var(--dry-waste))]';
      case 'hazardous':
        return 'bg-[hsl(var(--hazardous-waste)/0.1)] border-[hsl(var(--hazardous-waste))]';
      case 'reduction':
        return 'bg-[hsl(var(--brand-accent)/0.1)] border-[hsl(var(--brand-accent))]';
      default:
        return 'bg-secondary/20 border-border';
    }
  };

  if (!currentTip) {
    return null;
  }

  return (
    <Card className={`shadow-[var(--shadow-soft)] ${getCategoryColor(currentTip.category)} border-l-4`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
            {t.title}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousTip}
              disabled={isAnimating}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={randomTip}
              disabled={isAnimating}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              disabled={isAnimating}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getCategoryIcon(currentTip.category)}</span>
              <span className="text-sm font-medium capitalize">
                {t.category[currentTip.category as keyof typeof t.category] || currentTip.category}
              </span>
            </div>

            {/* Tip Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                {currentTip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentTip.content}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex gap-1">
                {greenTips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentTipIndex
                        ? 'bg-[hsl(var(--brand-primary))]'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentTipIndex + 1} of {greenTips.length}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};