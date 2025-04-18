
import { HealthMetric } from './api';

// Date and time formatters
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatTimeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
};

// Value formatters
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value);
};

// Health data formatters
export const getLatestMetric = (metrics: HealthMetric[]): HealthMetric | null => {
  if (!metrics || metrics.length === 0) return null;
  
  return metrics.reduce((latest, current) => {
    const latestDate = new Date(latest.timestamp);
    const currentDate = new Date(current.timestamp);
    return currentDate > latestDate ? current : latest;
  }, metrics[0]);
};

export const formatMetricValue = (metric: HealthMetric | null): string => {
  if (!metric) return 'N/A';
  
  return `${metric.value}${metric.unit}`;
};

export const getMetricTrend = (metrics: HealthMetric[], count: number = 2): 'up' | 'down' | 'stable' => {
  if (!metrics || metrics.length < count) return 'stable';
  
  // Sort by timestamp descending
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get the latest values
  const latestValues = sortedMetrics.slice(0, count);
  
  // Simple trend based on latest two values
  if (latestValues[0].value > latestValues[latestValues.length - 1].value) {
    return 'up';
  } else if (latestValues[0].value < latestValues[latestValues.length - 1].value) {
    return 'down';
  }
  
  return 'stable';
};

// Chart data formatters
export const prepareChartData = (metrics: HealthMetric[], period: 'day' | 'week' | 'month'): any[] => {
  if (!metrics || metrics.length === 0) return [];
  
  // Sort metrics by timestamp
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Format for recharts
  return sortedMetrics.map(metric => ({
    timestamp: period === 'day' ? formatTime(metric.timestamp) : formatDate(metric.timestamp),
    value: metric.value
  }));
};
