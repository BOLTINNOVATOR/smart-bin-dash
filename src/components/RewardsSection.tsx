import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const RewardsSection = () => {
  const currentPoints = 285;
  const nextRewardAt = 500;
  const progress = (currentPoints / nextRewardAt) * 100;

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', points: 1250, badge: '🏆' },
    { rank: 2, name: 'Mike Chen', points: 1180, badge: '🥈' },
    { rank: 3, name: 'Emma Wilson', points: 1050, badge: '🥉' },
    { rank: 4, name: 'David Brown', points: 890, badge: '🌟' },
    { rank: 5, name: 'You', points: currentPoints, badge: '⭐' },
  ];

  // Mock achievements
  const achievements = [
    { 
      title: 'Eco Warrior', 
      description: 'Sorted 100kg of waste', 
      icon: '🌱', 
      earned: true,
      progress: 100
    },
    { 
      title: 'Recycling Champion', 
      description: 'Recycled 50kg of materials', 
      icon: '♻️', 
      earned: true,
      progress: 100
    },
    { 
      title: 'Green Streak', 
      description: 'Used device 30 days straight', 
      icon: '🔥', 
      earned: true,
      progress: 100
    },
    { 
      title: 'Planet Protector', 
      description: 'Prevented 500kg CO2 emissions', 
      icon: '🌍', 
      earned: false,
      progress: 75
    },
    { 
      title: 'Waste Wizard', 
      description: 'Perfect sorting for 7 days', 
      icon: '🧙‍♂️', 
      earned: false,
      progress: 60
    },
    { 
      title: 'Clean Community', 
      description: 'Refer 5 friends to join', 
      icon: '👥', 
      earned: false,
      progress: 40
    },
  ];

  const rewards = [
    { points: 500, reward: '$25 Gift Card', description: 'Amazon, Target, or Starbucks' },
    { points: 1000, reward: '$50 Eco Products', description: 'Sustainable living essentials' },
    { points: 1500, reward: 'Premium Device Upgrade', description: 'Latest smart bin features' },
    { points: 2000, reward: '$100 Green Tech', description: 'Solar chargers, eco gadgets' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          🏆 Rewards & Gamification
        </h2>
        <Badge className="bg-[hsl(var(--eco-green))] text-white text-lg px-4 py-2">
          {currentPoints} Points
        </Badge>
      </div>

      {/* Rewards Tracker */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
            🎯 Next Reward Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">$25 Gift Card</span>
              <span className="text-sm text-[hsl(var(--muted-foreground))]">
                {nextRewardAt - currentPoints} points to go
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-4 bg-[hsl(var(--muted))]"
            />
            <div className="text-center text-sm text-[hsl(var(--muted-foreground))]">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
              🏅 Community Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div 
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    user.name === 'You' 
                      ? 'bg-[hsl(var(--eco-green))] bg-opacity-10 border-2 border-[hsl(var(--eco-green))]' 
                      : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))] hover:bg-opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.badge}</span>
                    <div>
                      <div className={`font-semibold ${
                        user.name === 'You' ? 'text-[hsl(var(--eco-green))]' : 'text-[hsl(var(--foreground))]'
                      }`}>
                        {user.name}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">
                        Rank #{user.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[hsl(var(--eco-green))]">
                    {user.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
              🎁 Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    currentPoints >= reward.points
                      ? 'border-[hsl(var(--eco-green))] bg-[hsl(var(--eco-green))] bg-opacity-10'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--muted))] bg-opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-[hsl(var(--foreground))]">
                        {reward.reward}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">
                        {reward.description}
                      </div>
                    </div>
                    <Badge 
                      variant={currentPoints >= reward.points ? 'default' : 'secondary'}
                      className={currentPoints >= reward.points ? 'bg-[hsl(var(--eco-green))] text-white' : ''}
                    >
                      {reward.points} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
            🏆 Achievement Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <Card 
                key={index}
                className={`transition-all duration-200 hover:shadow-lg ${
                  achievement.earned 
                    ? 'border-[hsl(var(--eco-green))] bg-[hsl(var(--eco-green))] bg-opacity-5' 
                    : 'border-[hsl(var(--border))] opacity-75'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-4xl mb-2 ${
                    achievement.earned ? '' : 'filter grayscale opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="font-semibold text-[hsl(var(--foreground))] mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
                    {achievement.description}
                  </div>
                  {achievement.earned ? (
                    <Badge className="bg-[hsl(var(--eco-green))] text-white">
                      ✅ Earned
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Progress 
                        value={achievement.progress} 
                        className="h-2 bg-[hsl(var(--muted))]"
                      />
                      <div className="text-xs text-[hsl(var(--muted-foreground))]">
                        {achievement.progress}% Complete
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;