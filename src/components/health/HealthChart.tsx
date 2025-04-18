
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { HealthMetric } from '@/lib/api';
import { prepareChartData } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HealthChartProps {
  title: string;
  metrics: HealthMetric[];
  color: string;
  period: 'day' | 'week' | 'month';
  onPeriodChange: (value: 'day' | 'week' | 'month') => void;
  unit: string;
  reference?: number;
}

const HealthChart: React.FC<HealthChartProps> = ({ 
  title, 
  metrics, 
  color,
  period,
  onPeriodChange,
  unit,
  reference
}) => {
  const data = prepareChartData(metrics, period);
  
  const getColorValue = () => {
    // Return a Tailwind color value based on the string
    switch (color) {
      case 'heart': return '#EF4444';
      case 'steps': return '#22C55E';
      case 'sleep': return '#8B5CF6';
      case 'calories': return '#F97316';
      case 'oxygen': return '#0EA5E9';
      default: return '#0EA5E9';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Select 
          value={period} 
          onValueChange={(value) => onPeriodChange(value as 'day' | 'week' | 'month')}
        >
          <SelectTrigger className="w-[100px] h-8">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColorValue()} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getColorValue()} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                unit={unit}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, title]}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }}
              />
              {reference && (
                <ReferenceLine 
                  y={reference} 
                  stroke="#94a3b8" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Target: ${reference}${unit}`,
                    position: 'insideBottomRight',
                    fill: '#64748b',
                    fontSize: 12
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={getColorValue()}
                fillOpacity={1}
                fill={`url(#color${color})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthChart;
