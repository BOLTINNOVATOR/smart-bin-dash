import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AchievementBadgesProps {
  userBadges?: string[];
  userStats?: {
    segregationScore: number;
    dryWaste: number;
    successfulPickups: number;
    zeroContaminationDays: number;
    consecutiveDays: number;
  };
}

export const AchievementBadges = ({ 
  userBadges = [], 
  userStats = {
    segregationScore: 94,
    dryWaste: 67,
    successfulPickups: 45,
    zeroContaminationDays: 8,
    consecutiveDays: 23
  }
}: AchievementBadgesProps) => {
  const { achievements, language } = useAppStore();

  const content = {
    en: {
      title: "Achievement Badges",
      subtitle: "Unlock badges by reaching milestones",
      earned: "Earned",
      progress: "Progress",
      requirements: "Requirements",
      points: "points"
    },
    hi: {
      title: "उपलब्धि बैज",
      subtitle: "मील के पत्थर तक पहुंचकर बैज अनलॉक करें",
      earned: "अर्जित",
      progress: "प्रगति",
      requirements: "आवश्यकताएं",
      points: "अंक"
    }
  };

  const t = content[language];

  const calculateProgress = (achievement: any): number => {
    const req = achievement.requirements;
    
    if (req.segregationScore && req.duration) {
      // For duration-based achievements, check score consistency
      const scoreProgress = (userStats.segregationScore / req.segregationScore) * 100;
      const durationProgress = (userStats.consecutiveDays / req.duration) * 100;
      return Math.min(Math.min(scoreProgress, durationProgress), 100);
    }
    
    if (req.dryWaste) {
      return Math.min((userStats.dryWaste / req.dryWaste) * 100, 100);
    }
    
    if (req.successfulPickups) {
      return Math.min((userStats.successfulPickups / req.successfulPickups) * 100, 100);
    }
    
    if (req.zeroContamination) {
      return Math.min((userStats.zeroContaminationDays / req.zeroContamination) * 100, 100);
    }
    
    return 0;
  };

  const isEarned = (achievement: any): boolean => {
    return userBadges.includes(achievement.name);
  };

  const getRequirementText = (achievement: any): string => {
    const req = achievement.requirements;
    
    if (req.segregationScore && req.duration) {
      return `${req.segregationScore}%+ score for ${req.duration} days`;
    }
    
    if (req.dryWaste) {
      return `Segregate ${req.dryWaste}kg dry waste`;
    }
    
    if (req.successfulPickups) {
      return `Complete ${req.successfulPickups} successful pickups`;
    }
    
    if (req.zeroContamination) {
      return `${req.zeroContamination} days zero contamination`;
    }
    
    return achievement.description;
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[hsl(var(--brand-accent))]" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const earned = isEarned(achievement);
            const progress = calculateProgress(achievement);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  earned
                    ? 'border-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)]'
                    : 'border-border bg-card hover:bg-secondary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`text-2xl ${earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      
                      {earned ? (
                        <Badge variant="secondary" className="bg-[hsl(var(--success))] text-white">
                          <Award className="h-3 w-3 mr-1" />
                          {t.earned}
                        </Badge>
                      ) : (
                        <div className="text-right">
                          <div className="text-sm font-medium text-[hsl(var(--brand-primary))]">
                            +{achievement.pointsReward} {t.points}
                          </div>
                        </div>
                      )}
                    </div>

                    {!earned && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t.progress}</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {getRequirementText(achievement)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};