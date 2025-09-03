import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, Recycle, Leaf, TreePine } from 'lucide-react';
import { motion } from 'framer-motion';

export const ImpactTracker = () => {
  const { households, pickupLogs, language } = useAppStore();

  const content = {
    en: {
      title: "Environmental Impact",
      subtitle: "Your contribution to a cleaner planet",
      metrics: {
        landfillDiverted: "Waste Diverted from Landfill",
        co2Saved: "CO₂ Emissions Prevented",
        recyclablesMaterial: "Recyclables Recovered",
        compostProduced: "Compost Produced"
      },
      units: {
        kg: "kg",
        tons: "tons",
        trees: "trees equivalent"
      }
    },
    hi: {
      title: "पर्यावरणीय प्रभाव",
      subtitle: "स्वच्छ ग्रह में आपका योगदान",
      metrics: {
        landfillDiverted: "लैंडफिल से अपशिष्ट बचाव",
        co2Saved: "CO₂ उत्सर्जन बचाव",
        recyclablesMaterial: "रीसाइक्लेबल रिकवर किया गया",
        compostProduced: "खाद उत्पादन"
      },
      units: {
        kg: "किलो",
        tons: "टन",
        trees: "वृक्ष समतुल्य"
      }
    }
  };

  const t = content[language];

  // Calculate impact metrics
  const totalWetWaste = households.reduce((sum, h) => sum + h.monthlyWaste.wet, 0);
  const totalDryWaste = households.reduce((sum, h) => sum + h.monthlyWaste.dry, 0);
  const totalHazardousWaste = households.reduce((sum, h) => sum + h.monthlyWaste.hazardous, 0);

  const impactMetrics = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: t.metrics.landfillDiverted,
      value: Math.round((totalWetWaste + totalDryWaste) * 0.78),
      unit: t.units.kg,
      color: 'text-[hsl(var(--brand-primary))]',
      bgColor: 'bg-[hsl(var(--brand-primary)/0.1)]'
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      label: t.metrics.co2Saved,
      value: Math.round((totalWetWaste + totalDryWaste) * 0.5),
      unit: t.units.kg,
      color: 'text-[hsl(var(--wet-waste))]',
      bgColor: 'bg-[hsl(var(--wet-waste)/0.1)]'
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      label: t.metrics.recyclablesMaterial,
      value: Math.round(totalDryWaste * 0.85),
      unit: t.units.kg,
      color: 'text-[hsl(var(--dry-waste))]',
      bgColor: 'bg-[hsl(var(--dry-waste)/0.1)]'
    },
    {
      icon: <TreePine className="h-6 w-6" />,
      label: t.metrics.compostProduced,
      value: Math.round(totalWetWaste * 0.3),
      unit: t.units.kg,
      color: 'text-[hsl(var(--brand-accent))]',
      bgColor: 'bg-[hsl(var(--brand-accent)/0.1)]'
    }
  ];

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}`;
    }
    return value.toString();
  };

  const formatUnit = (value: number, unit: string) => {
    if (value >= 1000 && unit === t.units.kg) {
      return t.units.tons;
    }
    return unit;
  };

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${metric.bgColor} p-4 rounded-lg border border-border`}
            >
              <div className="flex items-start gap-3">
                <div className={`${metric.color} ${metric.bgColor} p-2 rounded-md`}>
                  {metric.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${metric.color}`}>
                      {formatValue(metric.value)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatUnit(metric.value, metric.unit)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Impact Info */}
        <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TreePine className="h-4 w-4 text-[hsl(var(--brand-accent))]" />
            <span className="text-sm font-medium">Community Impact</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? `Your community has saved approximately ${Math.round((totalWetWaste + totalDryWaste) * 0.02)} ${t.units.trees} through proper waste segregation and recycling efforts.`
              : `आपके समुदाय ने उचित अपशिष्ट पृथक्करण और रीसाइक्लिंग प्रयासों के माध्यम से लगभग ${Math.round((totalWetWaste + totalDryWaste) * 0.02)} ${t.units.trees} बचाए हैं।`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};