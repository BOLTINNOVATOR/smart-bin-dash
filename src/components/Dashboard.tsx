import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import WasteAnalytics from './WasteAnalytics';
import RewardsSection from './RewardsSection';
import ContactSection from './ContactSection';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock data
  const weeklyWaste = 12.5;
  const lastItem = { type: 'Recyclable', item: 'Plastic Bottle', weight: '0.2 kg', time: '2 hours ago' };
  const deviceStatus = 'Active';
  const rewardPoints = 285;
  const nextRewardAt = 500;

  const progress = (rewardPoints / nextRewardAt) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[hsl(var(--eco-success))] text-white';
      case 'Bin Full': return 'bg-[hsl(var(--eco-warning))] text-black';
      default: return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Organic': return 'bg-[hsl(var(--eco-light-green))] text-white';
      case 'Recyclable': return 'bg-[hsl(var(--eco-blue))] text-white';
      case 'Hazardous': return 'bg-[hsl(var(--destructive))] text-white';
      default: return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <WasteAnalytics />;
      case 'rewards':
        return <RewardsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-[var(--shadow-soft)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-[hsl(var(--foreground))]">
                    🗑️ Weekly Waste
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--eco-green))]">
                    {weeklyWaste} kg
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                    Total this week
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-soft)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-[hsl(var(--foreground))]">
                    📦 Last Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className={getTypeColor(lastItem.type)}>
                      {lastItem.type}
                    </Badge>
                    <div className="text-lg font-semibold">{lastItem.item}</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))]">
                      {lastItem.weight} • {lastItem.time}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow-soft)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-[hsl(var(--foreground))]">
                    🔌 Device Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <Badge className={getStatusColor(deviceStatus)}>
                  {deviceStatus}
                </Badge>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                    Last sync: 5 minutes ago
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Incentives Snapshot */}
            <Card className="shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  🎯 Rewards Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Current Points</span>
                    <span className="text-2xl font-bold text-[hsl(var(--eco-green))]">
                      {rewardPoints}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-3 bg-[hsl(var(--muted))]"
                  />
                  <div className="flex justify-between text-sm text-[hsl(var(--muted-foreground))]">
                    <span>Progress to next reward</span>
                    <span>{nextRewardAt - rewardPoints} points remaining</span>
                  </div>
                  <div className="bg-[hsl(var(--eco-neutral))] p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <div className="font-semibold">Next Reward: $25 Gift Card</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                          {Math.round(progress)}% complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[hsl(var(--border))] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">♻️</span>
              <div>
                <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  Smart Waste Dashboard
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Bolt Innovators
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'rewards', label: 'Rewards', icon: '🏆' },
                { id: 'contact', label: 'Contact', icon: '📞' }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(item.id)}
                  className="flex items-center gap-2 transition-all duration-200"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-[hsl(var(--border))] px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'rewards', label: 'Rewards', icon: '🏆' },
            { id: 'contact', label: 'Contact', icon: '📞' }
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <span>{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;