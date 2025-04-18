
import React from 'react';
import { 
  Heart, 
  Footprints, 
  Moon, 
  Flame, 
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus 
} from 'lucide-react';
import { HealthMetric } from '@/lib/api';
import { formatMetricValue, getLatestMetric, getMetricTrend } from '@/lib/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthMetricCardProps {
  type: 'heart_rate' | 'steps' | 'sleep' | 'calories' | 'oxygen';
  title: string;
  metrics: HealthMetric[];
  onClick?: () => void;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ 
  type, 
  title, 
  metrics,
  onClick
}) => {
  const latestMetric = getLatestMetric(metrics);
  const trend = getMetricTrend(metrics);
  
  const getIcon = () => {
    switch (type) {
      case 'heart_rate':
        return <Heart className="h-6 w-6 text-health-heart" />;
      case 'steps':
        return <Footprints className="h-6 w-6 text-health-steps" />;
      case 'sleep':
        return <Moon className="h-6 w-6 text-health-sleep" />;
      case 'calories':
        return <Flame className="h-6 w-6 text-health-calories" />;
      case 'oxygen':
        return <Droplets className="h-6 w-6 text-health-oxygen" />;
      default:
        return null;
    }
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  const getCardColor = () => {
    switch (type) {
      case 'heart_rate':
        return 'border-l-4 border-l-health-heart';
      case 'steps':
        return 'border-l-4 border-l-health-steps';
      case 'sleep':
        return 'border-l-4 border-l-health-sleep';
      case 'calories':
        return 'border-l-4 border-l-health-calories';
      case 'oxygen':
        return 'border-l-4 border-l-health-oxygen';
      default:
        return '';
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
        getCardColor()
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getIcon()}
            <h3 className="ml-2 font-medium text-sm">{title}</h3>
          </div>
          {getTrendIcon()}
        </div>
        
        <div className="mt-2">
          <div className="text-2xl font-bold">
            {formatMetricValue(latestMetric)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type === 'heart_rate' || type === 'oxygen' 
              ? 'Last hour' 
              : 'Today'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
