import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, Battery, Thermometer, Droplets, Wind, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface BinSimulatorProps {
  binId?: string;
}

export const BinSimulator = ({ binId = 'bin-001' }: BinSimulatorProps) => {
  const { bins, sensorData, language, updateBin, updateSensorData } = useAppStore();
  const [selectedBin, setSelectedBin] = useState(binId);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Simulation controls
  const [fillLevel, setFillLevel] = useState([65]);
  const [weight, setWeight] = useState([13.2]);
  const [temperature, setTemperature] = useState([24.5]);
  const [humidity, setHumidity] = useState([68]);
  const [gasLevels, setGasLevels] = useState({
    methane: [15],
    ammonia: [10],
    hydrogen_sulfide: [4]
  });

  const bin = bins.find(b => b.id === selectedBin);
  const readings = sensorData[selectedBin] || [];

  const content = {
    en: {
      title: "Smart Bin Simulator",
      subtitle: "Real-time sensor monitoring and control",
      controls: "Sensor Controls",
      status: "Bin Status",
      alerts: "Active Alerts",
      fillLevel: "Fill Level",
      weight: "Weight",
      temperature: "Temperature",
      humidity: "Humidity",
      gasLevels: "Gas Levels",
      methane: "Methane",
      ammonia: "Ammonia",
      hydrogenSulfide: "Hydrogen Sulfide",
      batteryLevel: "Battery Level",
      location: "Location",
      lastReading: "Last Reading",
      simulate: "Start Simulation",
      stop: "Stop Simulation",
      units: {
        percent: "%",
        kg: "kg",
        celsius: "°C",
        ppm: "ppm"
      }
    },
    hi: {
      title: "स्मार्ट बिन सिमुलेटर",
      subtitle: "वास्तविक समय सेंसर निगरानी और नियंत्रण",
      controls: "सेंसर नियंत्रण",
      status: "बिन स्थिति",
      alerts: "सक्रिय अलर्ट",
      fillLevel: "भरण स्तर",
      weight: "वजन",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      gasLevels: "गैस स्तर",
      methane: "मीथेन",
      ammonia: "अमोनिया",
      hydrogenSulfide: "हाइड्रोजन सल्फाइड",
      batteryLevel: "बैटरी स्तर",
      location: "स्थान",
      lastReading: "अंतिम रीडिंग",
      simulate: "सिमुलेशन शुरू करें",
      stop: "सिमुलेशन रोकें",
      units: {
        percent: "%",
        kg: "किलो",
        celsius: "°C",
        ppm: "ppm"
      }
    }
  };

  const t = content[language];

  // Initialize values from bin data
  useEffect(() => {
    if (bin) {
      setFillLevel([bin.fillLevel]);
      const latestReading = readings[readings.length - 1];
      if (latestReading) {
        setWeight([latestReading.weight]);
        setTemperature([latestReading.temperature]);
        setHumidity([latestReading.humidity]);
        setGasLevels({
          methane: [latestReading.gasLevels.methane],
          ammonia: [latestReading.gasLevels.ammonia],
          hydrogen_sulfide: [latestReading.gasLevels.hydrogen_sulfide]
        });
      }
    }
  }, [bin, readings]);

  // Simulation logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulating) {
      interval = setInterval(() => {
        // Generate realistic sensor fluctuations
        const newReading = {
          timestamp: new Date().toISOString(),
          fillLevel: fillLevel[0] + (Math.random() - 0.5) * 2,
          weight: weight[0] + (Math.random() - 0.5) * 0.5,
          temperature: temperature[0] + (Math.random() - 0.5) * 1,
          humidity: humidity[0] + (Math.random() - 0.5) * 3,
          gasLevels: {
            methane: Math.max(0, gasLevels.methane[0] + (Math.random() - 0.5) * 2),
            ammonia: Math.max(0, gasLevels.ammonia[0] + (Math.random() - 0.5) * 2),
            hydrogen_sulfide: Math.max(0, gasLevels.hydrogen_sulfide[0] + (Math.random() - 0.5) * 1)
          },
          batteryLevel: bin?.batteryLevel || 85
        };

        // Update sensor data
        const updatedReadings = [...readings, newReading].slice(-20); // Keep last 20 readings
        updateSensorData(selectedBin, updatedReadings);

        // Update bin status based on readings
        let status: 'ok' | 'warning' | 'full' | 'offline' = 'ok';
        if (newReading.fillLevel >= 90) status = 'full';
        else if (newReading.fillLevel >= 75) status = 'warning';

        updateBin(selectedBin, {
          fillLevel: Math.round(newReading.fillLevel),
          status
        });
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, fillLevel, weight, temperature, humidity, gasLevels, selectedBin]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-[hsl(var(--success))]';
      case 'warning': return 'text-[hsl(var(--warning))]';
      case 'full': return 'text-[hsl(var(--destructive))]';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getAlerts = () => {
    const alerts = [];
    if (bin) {
      if (bin.fillLevel >= 90) alerts.push({ type: 'critical', message: 'Bin is full - immediate collection required' });
      if (bin.fillLevel >= 75) alerts.push({ type: 'warning', message: 'Bin approaching capacity' });
      if (bin.batteryLevel <= 20) alerts.push({ type: 'warning', message: 'Low battery level' });
      if (gasLevels.methane[0] > 30) alerts.push({ type: 'warning', message: 'High methane levels detected' });
    }
    return alerts;
  };

  const alerts = getAlerts();

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[hsl(var(--brand-primary))]" />
            {t.title}
          </div>
          <Button
            onClick={() => setIsSimulating(!isSimulating)}
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
          >
            {isSimulating ? t.stop : t.simulate}
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bin Selection */}
        <div className="flex gap-2">
          {bins.slice(0, 3).map((b) => (
            <Button
              key={b.id}
              variant={selectedBin === b.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBin(b.id)}
            >
              {b.id.replace('bin-', 'Bin ')}
            </Button>
          ))}
        </div>

        {bin && (
          <>
            {/* Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className={`text-lg font-bold ${getStatusColor(bin.status)}`}>
                  {bin.status.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">{t.status}</div>
              </div>
              
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-lg font-bold">{bin.fillLevel}%</div>
                <div className="text-sm text-muted-foreground">{t.fillLevel}</div>
              </div>
              
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <Battery className="h-4 w-4" />
                  {bin.batteryLevel}%
                </div>
                <div className="text-sm text-muted-foreground">{t.batteryLevel}</div>
              </div>
              
              <div className="text-center p-3 bg-secondary/20 rounded-lg">
                <div className="text-lg font-bold text-[hsl(var(--brand-accent))]">
                  {readings.length}
                </div>
                <div className="text-sm text-muted-foreground">{t.lastReading}</div>
              </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
                  {t.alerts}
                </h4>
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'critical'
                        ? 'bg-[hsl(var(--destructive)/0.1)] border-[hsl(var(--destructive))]'
                        : 'bg-[hsl(var(--warning)/0.1)] border-[hsl(var(--warning))]'
                    }`}
                  >
                    <p className="text-sm">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Sensor Controls */}
            <div className="space-y-4">
              <h4 className="font-medium">{t.controls}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fill Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{t.fillLevel}</label>
                    <span className="text-sm text-muted-foreground">
                      {fillLevel[0].toFixed(1)}{t.units.percent}
                    </span>
                  </div>
                  <Slider
                    value={fillLevel}
                    onValueChange={setFillLevel}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <Progress value={fillLevel[0]} className="h-2" />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{t.weight}</label>
                    <span className="text-sm text-muted-foreground">
                      {weight[0].toFixed(1)}{t.units.kg}
                    </span>
                  </div>
                  <Slider
                    value={weight}
                    onValueChange={setWeight}
                    max={25}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {t.temperature}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {temperature[0].toFixed(1)}{t.units.celsius}
                    </span>
                  </div>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={15}
                    max={40}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Humidity */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {t.humidity}
                    </label>
                    <span className="text-sm text-muted-foreground">
                      {humidity[0].toFixed(1)}{t.units.percent}
                    </span>
                  </div>
                  <Slider
                    value={humidity}
                    onValueChange={setHumidity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Gas Levels */}
              <div className="space-y-3">
                <h5 className="font-medium flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  {t.gasLevels}
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">{t.methane}</label>
                      <span className="text-sm text-muted-foreground">
                        {gasLevels.methane[0].toFixed(1)} {t.units.ppm}
                      </span>
                    </div>
                    <Slider
                      value={gasLevels.methane}
                      onValueChange={(value) => setGasLevels(prev => ({ ...prev, methane: value }))}
                      max={50}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">{t.ammonia}</label>
                      <span className="text-sm text-muted-foreground">
                        {gasLevels.ammonia[0].toFixed(1)} {t.units.ppm}
                      </span>
                    </div>
                    <Slider
                      value={gasLevels.ammonia}
                      onValueChange={(value) => setGasLevels(prev => ({ ...prev, ammonia: value }))}
                      max={30}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">{t.hydrogenSulfide}</label>
                      <span className="text-sm text-muted-foreground">
                        {gasLevels.hydrogen_sulfide[0].toFixed(1)} {t.units.ppm}
                      </span>
                    </div>
                    <Slider
                      value={gasLevels.hydrogen_sulfide}
                      onValueChange={(value) => setGasLevels(prev => ({ ...prev, hydrogen_sulfide: value }))}
                      max={15}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[hsl(var(--brand-primary))]" />
                <span className="font-medium">{t.location}</span>
              </div>
              <p className="text-sm text-muted-foreground">{bin.address}</p>
              <p className="text-xs text-muted-foreground">
                Coordinates: {bin.location.lat.toFixed(4)}, {bin.location.lng.toFixed(4)}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};