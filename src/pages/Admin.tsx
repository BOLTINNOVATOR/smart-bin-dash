import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/useAppStore';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Truck, 
  AlertTriangle,
  TrendingUp,
  Recycle,
  Shield,
  Download,
  Settings,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const Admin = () => {
  const { 
    households, 
    bins, 
    collectors, 
    routes, 
    complaints, 
    pickupLogs, 
    language, 
    initializeData 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const content = {
    en: {
      title: "ULB Admin Dashboard",
      subtitle: "Municipal Waste Management Control Center",
      tabs: {
        overview: "Overview",
        bins: "Bin Management", 
        routes: "Route Planning",
        complaints: "Complaints",
        analytics: "Analytics",
        settings: "Settings"
      },
      metrics: {
        totalHouseholds: "Total Households",
        activeBins: "Active Bins",
        collectorsOnDuty: "Collectors On Duty",
        pendingComplaints: "Pending Complaints",
        segregationRate: "Segregation Rate",
        landfillDiversion: "Landfill Diversion",
        monthlyWaste: "Monthly Waste Processed",
        routeEfficiency: "Route Efficiency"
      },
      actions: {
        exportData: "Export Data",
        generateReport: "Generate Report",
        createRoute: "Create Route",
        assignCollector: "Assign Collector",
        resolveComplaint: "Resolve Complaint",
        downloadCSV: "Download CSV"
      }
    },
    hi: {
      title: "ULB एडमिन डैशबोर्ड",
      subtitle: "नगरपालिका अपशिष्ट प्रबंधन नियंत्रण केंद्र",
      tabs: {
        overview: "अवलोकन",
        bins: "बिन प्रबंधन",
        routes: "मार्ग योजना",
        complaints: "शिकायतें",
        analytics: "विश्लेषण",
        settings: "सेटिंग्स"
      },
      metrics: {
        totalHouseholds: "कुल परिवार",
        activeBins: "सक्रिय बिन",
        collectorsOnDuty: "ड्यूटी पर संग्रहकर्ता",
        pendingComplaints: "लंबित शिकायतें",
        segregationRate: "पृथक्करण दर",
        landfillDiversion: "लैंडफिल डायवर्जन",
        monthlyWaste: "मासिक अपशिष्ट प्रसंस्करण",
        routeEfficiency: "मार्ग दक्षता"
      },
      actions: {
        exportData: "डेटा निर्यात करें",
        generateReport: "रिपोर्ट बनाएं",
        createRoute: "मार्ग बनाएं",
        assignCollector: "संग्रहकर्ता नियुक्त करें",
        resolveComplaint: "शिकायत हल करें",
        downloadCSV: "CSV डाउनलोड करें"
      }
    }
  };

  const t = content[language];

  // Calculate KPIs
  const totalHouseholds = households.length;
  const activeBins = bins.filter(bin => bin.status !== 'offline').length;
  const collectorsOnDuty = collectors.filter(collector => collector.status === 'active').length;
  const pendingComplaints = complaints.filter(complaint => complaint.status !== 'resolved').length;
  
  const avgSegregationRate = households.reduce((sum, h) => sum + h.segregationScore, 0) / households.length || 0;
  const totalWaste = households.reduce((sum, h) => sum + h.monthlyWaste.wet + h.monthlyWaste.dry + h.monthlyWaste.hazardous, 0);
  const divertedWaste = totalWaste * 0.78; // 78% diversion rate
  
  // Chart data
  const wasteByTypeData = [
    { 
      name: 'Wet Waste', 
      value: households.reduce((sum, h) => sum + h.monthlyWaste.wet, 0),
      color: 'hsl(var(--wet-waste))'
    },
    { 
      name: 'Dry Waste', 
      value: households.reduce((sum, h) => sum + h.monthlyWaste.dry, 0),
      color: 'hsl(var(--dry-waste))'
    },
    { 
      name: 'Hazardous Waste', 
      value: households.reduce((sum, h) => sum + h.monthlyWaste.hazardous, 0),
      color: 'hsl(var(--hazardous-waste))'
    }
  ];

  const wardPerformanceData = households
    .reduce((acc, household) => {
      const ward = household.ward;
      if (!acc[ward]) {
        acc[ward] = { ward, totalScore: 0, count: 0 };
      }
      acc[ward].totalScore += household.segregationScore;
      acc[ward].count += 1;
      return acc;
    }, {} as Record<string, any>)
    .valueOf();

  const wardData = Object.values(wardPerformanceData).map((ward: any) => ({
    ward: ward.ward.replace('Ward ', ''),
    score: Math.round(ward.totalScore / ward.count),
    households: ward.count
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': case 'active': case 'resolved':
        return 'bg-[hsl(var(--success))] text-white';
      case 'warning': case 'in_progress':
        return 'bg-[hsl(var(--warning))] text-white';
      case 'full': case 'high': case 'open':
        return 'bg-[hsl(var(--destructive))] text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const exportData = (type: string) => {
    // Simulate data export
    const data = {
      bins: bins,
      households: households,
      complaints: complaints,
      routes: routes,
      pickupLogs: pickupLogs
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `waste-management-${type}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => exportData('full')}>
                <Download className="h-4 w-4 mr-2" />
                {t.actions.exportData}
              </Button>
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                {t.actions.generateReport}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t.tabs.overview}</TabsTrigger>
            <TabsTrigger value="bins">{t.tabs.bins}</TabsTrigger>
            <TabsTrigger value="routes">{t.tabs.routes}</TabsTrigger>
            <TabsTrigger value="complaints">{t.tabs.complaints}</TabsTrigger>
            <TabsTrigger value="analytics">{t.tabs.analytics}</TabsTrigger>
            <TabsTrigger value="settings">{t.tabs.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--brand-primary)/0.1)] rounded-lg">
                        <Users className="h-6 w-6 text-[hsl(var(--brand-primary))]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.metrics.totalHouseholds}</p>
                        <p className="text-2xl font-bold">{totalHouseholds}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--success)/0.1)] rounded-lg">
                        <MapPin className="h-6 w-6 text-[hsl(var(--success))]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.metrics.activeBins}</p>
                        <p className="text-2xl font-bold">{activeBins}/{bins.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--brand-accent)/0.1)] rounded-lg">
                        <Truck className="h-6 w-6 text-[hsl(var(--brand-accent))]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.metrics.collectorsOnDuty}</p>
                        <p className="text-2xl font-bold">{collectorsOnDuty}/{collectors.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--warning)/0.1)] rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-[hsl(var(--warning))]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.metrics.pendingComplaints}</p>
                        <p className="text-2xl font-bold">{pendingComplaints}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t.metrics.segregationRate}</p>
                    <p className="text-2xl font-bold">{Math.round(avgSegregationRate)}%</p>
                    <Progress value={avgSegregationRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t.metrics.landfillDiversion}</p>
                    <p className="text-2xl font-bold">{Math.round((divertedWaste / totalWaste) * 100)}%</p>
                    <Progress value={(divertedWaste / totalWaste) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t.metrics.monthlyWaste}</p>
                    <p className="text-2xl font-bold">{Math.round(totalWaste)}kg</p>
                    <p className="text-xs text-muted-foreground">+12% vs last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t.metrics.routeEfficiency}</p>
                    <p className="text-2xl font-bold">87%</p>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Waste Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={wasteByTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${Math.round(value)}kg`}
                      >
                        {wasteByTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ward Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={wardData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ward" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(var(--brand-primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bins">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Bin Management
                  <Button>Add New Bin</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bins.map((bin) => (
                    <div key={bin.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(bin.status)}>
                          {bin.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{bin.id}</p>
                          <p className="text-sm text-muted-foreground">{bin.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Fill: {bin.fillLevel}%</span>
                        <span>Battery: {bin.batteryLevel}%</span>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Route Planning
                  <Button>{t.actions.createRoute}</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{route.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {route.distance} • {route.estimatedTime} • {route.binIds.length} bins
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                        <Button variant="outline" size="sm">Edit Route</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{complaint.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {complaint.location.address} • {new Date(complaint.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(complaint.priority)}>
                          {complaint.priority}
                        </Badge>
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                        {complaint.status !== 'resolved' && (
                          <Button variant="outline" size="sm">
                            {t.actions.resolveComplaint}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Detailed analytics and reporting tools coming soon...</p>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Export Charts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Configuration options and system settings will be available here.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};