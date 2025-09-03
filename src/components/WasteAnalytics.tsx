import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title 
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const WasteAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  // Mock data for different time periods
  const mockData = {
    week: {
      composition: {
        organic: 45,
        recyclable: 35,
        hazardous: 20
      },
      trend: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [2.1, 1.8, 2.5, 2.2, 1.9, 3.1, 2.8]
      }
    },
    month: {
      composition: {
        organic: 52,
        recyclable: 31,
        hazardous: 17
      },
      trend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [14.5, 12.8, 16.2, 13.9]
      }
    },
    all: {
      composition: {
        organic: 48,
        recyclable: 33,
        hazardous: 19
      },
      trend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [45.2, 52.1, 48.9, 55.3, 51.7, 58.4]
      }
    }
  };

  const currentData = mockData[timeFilter as keyof typeof mockData];

  const compositionData = {
    labels: ['Organic', 'Recyclable', 'Hazardous'],
    datasets: [
      {
        data: [
          currentData.composition.organic,
          currentData.composition.recyclable,
          currentData.composition.hazardous
        ],
        backgroundColor: [
          'hsl(120, 60%, 50%)',
          'hsl(195, 85%, 41%)',
          'hsl(0, 84%, 60%)'
        ],
        borderColor: [
          'hsl(120, 60%, 40%)',
          'hsl(195, 85%, 31%)',
          'hsl(0, 84%, 50%)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const trendData = {
    labels: currentData.trend.labels,
    datasets: [
      {
        label: 'Waste (kg)',
        data: currentData.trend.data,
        borderColor: 'hsl(142, 76%, 36%)',
        backgroundColor: 'hsl(142, 76%, 36%, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'hsl(142, 76%, 36%)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'hsl(0, 0%, 0%, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'hsl(142, 76%, 36%)',
        borderWidth: 1,
      }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(120, 20%, 85%)',
        },
        ticks: {
          color: 'hsl(150, 15%, 45%)',
        }
      },
      x: {
        grid: {
          color: 'hsl(120, 20%, 85%)',
        },
        ticks: {
          color: 'hsl(150, 15%, 45%)',
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          📈 Waste Analytics
        </h2>
        <div className="flex gap-2">
          {[
            { id: 'week', label: 'Last Week' },
            { id: 'month', label: 'Last Month' },
            { id: 'all', label: 'All Time' }
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={timeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter.id)}
              className="transition-all duration-200"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Composition Chart */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
              🥧 Waste Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={compositionData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="w-4 h-4 bg-[hsl(120,60%,50%)] rounded mx-auto"></div>
                <div className="text-sm font-semibold">Organic</div>
                <div className="text-lg font-bold text-[hsl(var(--eco-light-green))]">
                  {currentData.composition.organic}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 bg-[hsl(195,85%,41%)] rounded mx-auto"></div>
                <div className="text-sm font-semibold">Recyclable</div>
                <div className="text-lg font-bold text-[hsl(var(--eco-blue))]">
                  {currentData.composition.recyclable}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 bg-[hsl(0,84%,60%)] rounded mx-auto"></div>
                <div className="text-sm font-semibold">Hazardous</div>
                <div className="text-lg font-bold text-[hsl(var(--destructive))]">
                  {currentData.composition.hazardous}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disposal Trend Chart */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--foreground))]">
              📊 Disposal Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={trendData} options={lineOptions} />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">
                Average: {(currentData.trend.data.reduce((a, b) => a + b, 0) / currentData.trend.data.length).toFixed(1)} kg
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[hsl(var(--eco-green))]">
              {currentData.trend.data.reduce((a, b) => a + b, 0).toFixed(1)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Total Waste (kg)
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[hsl(var(--eco-light-green))]">
              {(currentData.trend.data.reduce((a, b) => a + b, 0) * currentData.composition.organic / 100).toFixed(1)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Organic (kg)
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[hsl(var(--eco-blue))]">
              {(currentData.trend.data.reduce((a, b) => a + b, 0) * currentData.composition.recyclable / 100).toFixed(1)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Recyclable (kg)
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[hsl(var(--destructive))]">
              {(currentData.trend.data.reduce((a, b) => a + b, 0) * currentData.composition.hazardous / 100).toFixed(1)}
            </div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">
              Hazardous (kg)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteAnalytics;