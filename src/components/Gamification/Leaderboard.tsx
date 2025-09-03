import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/useAppStore';
import { Trophy, Medal, Award } from 'lucide-react';

export const Leaderboard = () => {
  const { households, language } = useAppStore();

  const content = {
    en: {
      title: "Community Leaderboard",
      subtitle: "Top performers in waste segregation",
      rank: "Rank",
      household: "Household",
      score: "Score",
      points: "Points",
      badges: "Badges"
    },
    hi: {
      title: "सामुदायिक लीडरबोर्ड",
      subtitle: "अपशिष्ट पृथक्करण में शीर्ष प्रदर्शनकर्ता",
      rank: "रैंक",
      household: "परिवार",
      score: "स्कोर",
      points: "अंक",
      badges: "बैज"
    }
  };

  const t = content[language];

  // Sort households by segregation score
  const topHouseholds = [...households]
    .sort((a, b) => b.segregationScore - a.segregationScore)
    .slice(0, 10);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-[hsl(var(--success))]';
    if (score >= 85) return 'text-[hsl(var(--brand-primary))]';
    if (score >= 70) return 'text-[hsl(var(--warning))]';
    return 'text-[hsl(var(--destructive))]';
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[hsl(var(--brand-accent))]" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topHouseholds.map((household, index) => (
            <div
              key={household.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                index < 3 ? 'bg-secondary/50 border border-border' : 'hover:bg-secondary/20'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[hsl(var(--brand-primary)/0.1)] text-[hsl(var(--brand-primary))]">
                  {household.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Household Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{household.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {household.society}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className={`font-bold ${getScoreColor(household.segregationScore)}`}>
                  {household.segregationScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {household.rewardPoints} {t.points.toLowerCase()}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 max-w-[100px]">
                {household.badges.slice(0, 2).map((badge, badgeIndex) => (
                  <Badge
                    key={badgeIndex}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                  >
                    {badge.includes('Warrior') && '🏆'}
                    {badge.includes('Buster') && '♻️'}
                    {badge.includes('Guardian') && '🌱'}
                    {badge.includes('Champion') && '🥇'}
                    {badge.includes('Hero') && '⭐'}
                  </Badge>
                ))}
                {household.badges.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{household.badges.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};