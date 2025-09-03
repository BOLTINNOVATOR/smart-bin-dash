import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { 
  Calendar, 
  Bell, 
  Camera, 
  MapPin, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Gift,
  QrCode,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Citizen = () => {
  const { user, language } = useAppStore();
  const [activeTab, setActiveTab] = useState('checklist');

  const content = {
    en: {
      title: "Citizen Portal",
      subtitle: "Track your waste segregation and earn rewards",
      tabs: {
        checklist: "Daily Checklist",
        schedule: "Pickup Schedule", 
        complaints: "Report Issue",
        rewards: "My Rewards",
        guide: "Segregation Guide"
      },
      checklist: {
        title: "Today's Segregation Checklist",
        wet: "Wet waste segregated",
        dry: "Dry waste segregated", 
        hazardous: "Hazardous waste (if any)",
        scan: "QR code scanned",
        points: "Points earned today"
      },
      schedule: {
        title: "Collection Schedule",
        next: "Next Pickup",
        wet_schedule: "Wet waste: Daily 6-8 AM",
        dry_schedule: "Dry waste: Mon, Wed, Fri 10-12 PM",
        hazardous_schedule: "Hazardous: 2nd Saturday of month",
        notifications: "Enable Notifications"
      },
      complaints: {
        title: "Report an Issue",
        type: "Issue Type",
        location: "Location",
        description: "Description", 
        photo: "Add Photo",
        submit: "Submit Report"
      },
      guide: {
        title: "Home Composting Guide",
        steps: "Easy Steps to Compost at Home",
        dropoff: "E-waste & Hazardous Drop-off Points"
      }
    },
    hi: {
      title: "नागरिक पोर्टल",
      subtitle: "अपने अपशिष्ट पृथक्करण को ट्रैक करें और पुरस्कार अर्जित करें",
      tabs: {
        checklist: "दैनिक चेकलिस्ट",
        schedule: "पिकअप शेड्यूल",
        complaints: "शिकायत दर्ज करें",
        rewards: "मेरे पुरस्कार", 
        guide: "पृथक्करण गाइड"
      },
      checklist: {
        title: "आज की पृथक्करण चेकलिस्ट",
        wet: "गीला कचरा अलग किया गया",
        dry: "सूखा कचरा अलग किया गया",
        hazardous: "खतरनाक कचरा (यदि कोई है)",
        scan: "QR कोड स्कैन किया गया",
        points: "आज अर्जित अंक"
      },
      schedule: {
        title: "संग्रह अनुसूची",
        next: "अगला पिकअप",
        wet_schedule: "गीला कचरा: दैनिक सुबह 6-8 बजे",
        dry_schedule: "सूखा कचरा: सोम, बुध, शुक्र सुबह 10-12 बजे",
        hazardous_schedule: "खतरनाक: महीने का दूसरा शनिवार",
        notifications: "सूचनाएं सक्षम करें"
      },
      complaints: {
        title: "समस्या की रिपोर्ट करें",
        type: "समस्या प्रकार",
        location: "स्थान",
        description: "विवरण",
        photo: "फोटो जोड़ें",
        submit: "रिपोर्ट जमा करें"
      },
      guide: {
        title: "घरेलू कंपोस्टिंग गाइड",
        steps: "घर पर कंपोस्ट बनाने के आसान तरीके",
        dropoff: "ई-कचरा और खतरनाक ड्रॉप-ऑफ पॉइंट्स"
      }
    }
  };

  const t = content[language];

  const checklistItems = [
    { key: 'wet', label: t.checklist.wet, completed: true, points: 10 },
    { key: 'dry', label: t.checklist.dry, completed: true, points: 8 },
    { key: 'hazardous', label: t.checklist.hazardous, completed: false, points: 0 },
    { key: 'scan', label: t.checklist.scan, completed: true, points: 5 }
  ];

  const totalPointsToday = checklistItems
    .filter(item => item.completed)
    .reduce((sum, item) => sum + item.points, 0);

  const renderChecklist = () => (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✅ {t.checklist.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checklistItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <CheckCircle 
                className={`h-5 w-5 ${
                  item.completed ? 'text-[hsl(var(--success))]' : 'text-muted-foreground'
                }`} 
              />
              <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                {item.label}
              </span>
            </div>
            <Badge variant={item.completed ? "default" : "outline"}>
              +{item.points} pts
            </Badge>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-[hsl(var(--success)/0.1)] rounded-lg border border-[hsl(var(--success)/0.2)]">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.checklist.points}</span>
            <span className="text-2xl font-bold text-[hsl(var(--success))]">
              {totalPointsToday}
            </span>
          </div>
        </div>

        <Button className="w-full flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Scan QR Code
        </Button>
      </CardContent>
    </Card>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Next Pickup */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t.schedule.next}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-[hsl(var(--brand-primary)/0.1)] rounded-lg border border-[hsl(var(--brand-primary)/0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Tomorrow, 7:00 AM</div>
                <div className="text-sm text-muted-foreground">Wet Waste Collection</div>
              </div>
              <div className="text-2xl">🗑️</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t.schedule.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="w-4 h-4 bg-[hsl(var(--wet-waste))] rounded"></div>
              <span>{t.schedule.wet_schedule}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="w-4 h-4 bg-[hsl(var(--dry-waste))] rounded"></div>
              <span>{t.schedule.dry_schedule}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="w-4 h-4 bg-[hsl(var(--hazardous-waste))] rounded"></div>
              <span>{t.schedule.hazardous_schedule}</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t.schedule.notifications}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplaints = () => (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📝 {t.complaints.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.complaints.type}</label>
            <select className="w-full p-2 border rounded-md">
              <option>Missed Pickup</option>
              <option>Mixed Waste</option>
              <option>Overflowing Bin</option>
              <option>Device Issue</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.complaints.location}</label>
            <Input placeholder="Enter location or use GPS" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.complaints.description}</label>
          <Textarea placeholder="Describe the issue in detail..." rows={4} />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          {t.complaints.photo}
        </Button>
        
        <Button className="w-full">
          {t.complaints.submit}
        </Button>
      </CardContent>
    </Card>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      {/* Current Points */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🏆</div>
            <div>
              <div className="text-3xl font-bold text-[hsl(var(--brand-primary))]">
                {user?.points || 285}
              </div>
              <div className="text-muted-foreground">Total Points</div>
            </div>
            <Progress value={57} className="w-full" />
            <div className="text-sm text-muted-foreground">
              215 points to next reward
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "₹25 Gift Voucher", points: 500, available: true },
            { name: "₹50 Gift Voucher", points: 1000, available: false },
            { name: "Eco-friendly Kit", points: 750, available: false }
          ].map((reward, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{reward.name}</div>
                <div className="text-sm text-muted-foreground">{reward.points} points</div>
              </div>
              <Button 
                variant={reward.available ? "default" : "outline"}
                size="sm"
                disabled={!reward.available}
              >
                {reward.available ? "Redeem" : "Locked"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderGuide = () => (
    <div className="space-y-6">
      {/* Composting Guide */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌱 {t.guide.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm font-medium">{t.guide.steps}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Choose a container with drainage",
                "Layer brown and green materials", 
                "Turn weekly for aeration",
                "Maintain moisture balance",
                "Harvest compost in 2-3 months",
                "Use as natural fertilizer"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-6 h-6 bg-[hsl(var(--brand-primary))] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Points */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t.guide.dropoff}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Central Mall Collection Point", distance: "0.5 km", type: "E-waste & Batteries" },
              { name: "Community Center", distance: "1.2 km", type: "Hazardous Chemicals" },
              { name: "Municipal Office", distance: "2.1 km", type: "Medical Waste" }
            ].map((point, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-medium">{point.name}</div>
                  <div className="text-sm text-muted-foreground">{point.type}</div>
                </div>
                <div className="text-sm font-medium text-[hsl(var(--brand-primary))]">
                  {point.distance}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'checklist', label: t.tabs.checklist, icon: '✅' },
    { id: 'schedule', label: t.tabs.schedule, icon: '📅' },
    { id: 'complaints', label: t.tabs.complaints, icon: '📝' },
    { id: 'rewards', label: t.tabs.rewards, icon: '🏆' },
    { id: 'guide', label: t.tabs.guide, icon: '📚' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'checklist':
        return renderChecklist();
      case 'schedule':
        return renderSchedule();
      case 'complaints':
        return renderComplaints();
      case 'rewards':
        return renderRewards();
      case 'guide':
        return renderGuide();
      default:
        return renderChecklist();
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
          
          {user && (
            <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
              <div className="text-center">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.society}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-[hsl(var(--brand-primary))]">{user.points}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};