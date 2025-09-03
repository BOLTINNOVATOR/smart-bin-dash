import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Recycle, Shield, BarChart3 } from 'lucide-react';

export const Home = () => {
  const { language, setCurrentPage } = useAppStore();

  const content = {
    en: {
      hero: {
        title: "Smart Waste Segregation at Source",
        subtitle: "Automated classification of wet, dry, and hazardous waste using IoT sensors and machine learning",
        cta1: "Try Smart Bin Demo",
        cta2: "Report an Issue",
        cta3: "ULB Admin Login"
      },
      impact: {
        title: "Real-time Impact",
        segregation: "Segregation Rate",
        diversion: "Landfill Diversion",
        hazardous: "Hazardous Captures"
      },
      features: {
        title: "How It Works",
        step1: {
          title: "Smart Detection",
          desc: "IoT sensors and ML classify waste automatically"
        },
        step2: {
          title: "Real-time Monitoring", 
          desc: "Track bin fill levels and optimize collection routes"
        },
        step3: {
          title: "Processing & Recovery",
          desc: "Route to composting, recycling, or safe disposal"
        },
        step4: {
          title: "Analytics & Reports",
          desc: "Municipal dashboards and compliance reporting"
        }
      },
      compliance: {
        title: "SWM Rules 2016 Compliance",
        desc: "Fully aligned with India's Solid Waste Management Rules for household segregation into wet, dry, and domestic hazardous categories."
      }
    },
    hi: {
      hero: {
        title: "स्रोत पर स्मार्ट अपशिष्ट पृथक्करण",
        subtitle: "IoT सेंसर और मशीन लर्निंग का उपयोग करके गीले, सूखे और खतरनाक कचरे का स्वचालित वर्गीकरण",
        cta1: "स्मार्ट बिन डेमो आज़माएं",
        cta2: "समस्या रिपोर्ट करें",
        cta3: "ULB एडमिन लॉगिन"
      },
      impact: {
        title: "वास्तविक समय प्रभाव",
        segregation: "पृथक्करण दर",
        diversion: "लैंडफिल डायवर्जन",
        hazardous: "खतरनाक कैप्चर"
      },
      features: {
        title: "यह कैसे काम करता है",
        step1: {
          title: "स्मार्ट डिटेक्शन",
          desc: "IoT सेंसर और ML अपशिष्ट को स्वचालित रूप से वर्गीकृत करते हैं"
        },
        step2: {
          title: "रीयल-टाइम मॉनिटरिंग",
          desc: "बिन भरने के स्तर को ट्रैक करें और संग्रह मार्गों को अनुकूलित करें"
        },
        step3: {
          title: "प्रसंस्करण और रिकवरी",
          desc: "कंपोस्टिंग, रीसाइक्लिंग, या सुरक्षित निपटान के लिए मार्ग"
        },
        step4: {
          title: "एनालिटिक्स और रिपोर्ट",
          desc: "नगरपालिका डैशबोर्ड और अनुपालन रिपोर्टिंग"
        }
      },
      compliance: {
        title: "SWM नियम 2016 अनुपालन",
        desc: "घरेलू पृथक्करण के लिए भारत के ठोस अपशिष्ट प्रबंधन नियमों के साथ पूर्ण रूप से संरेखित गीले, सूखे और घरेलू खतरनाक श्रेणियों में।"
      }
    }
  };

  const t = content[language];

  const impactStats = [
    { label: t.impact.segregation, value: "94%", color: "text-[hsl(var(--success))]" },
    { label: t.impact.diversion, value: "78%", color: "text-[hsl(var(--brand-accent))]" },
    { label: t.impact.hazardous, value: "156", color: "text-[hsl(var(--warning))]" }
  ];

  const features = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: t.features.step1.title, 
      desc: t.features.step1.desc,
      color: "border-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary)/0.1)]"
    },
    { 
      icon: <BarChart3 className="h-8 w-8" />, 
      title: t.features.step2.title, 
      desc: t.features.step2.desc,
      color: "border-[hsl(var(--brand-accent))] bg-[hsl(var(--brand-accent)/0.1)]"
    },
    { 
      icon: <Recycle className="h-8 w-8" />, 
      title: t.features.step3.title, 
      desc: t.features.step3.desc,
      color: "border-[hsl(var(--wet-waste))] bg-[hsl(var(--wet-waste)/0.1)]"
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: t.features.step4.title, 
      desc: t.features.step4.desc,
      color: "border-[hsl(var(--hazardous-waste))] bg-[hsl(var(--hazardous-waste)/0.1)]"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-secondary/20 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-accent))] bg-clip-text text-transparent">
                {t.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t.hero.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setCurrentPage('/demo')}
                className="flex items-center gap-2"
              >
                {t.hero.cta1}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setCurrentPage('/citizen')}
              >
                {t.hero.cta2}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setCurrentPage('/admin')}
              >
                {t.hero.cta3}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold">{t.impact.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {impactStats.map((stat, index) => (
                <Card key={index} className="text-center shadow-[var(--shadow-soft)]">
                  <CardContent className="pt-6">
                    <div className={`text-4xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground mt-2">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-12"
          >
            <h2 className="text-3xl font-bold text-center">{t.features.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className={`${feature.color} border-2 shadow-[var(--shadow-soft)]`}>
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-6"
          >
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              {t.compliance.title}
            </Badge>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.compliance.desc}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};